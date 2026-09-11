import keytar from "/usr/local/lib/node_modules/genlayer/node_modules/keytar/lib/keytar.js";
import { createAccount, createClient, abi } from "/usr/local/lib/node_modules/genlayer/node_modules/genlayer-js/dist/index.js";
import { testnetBradbury } from "/usr/local/lib/node_modules/genlayer/node_modules/genlayer-js/dist/chains/index.js";
import { encodeFunctionData, parseEventLogs } from "/usr/local/lib/node_modules/genlayer/node_modules/viem/_esm/index.js";
import { createHash } from "node:crypto";

const RPC = process.env.COURT_RPC ?? "https://rpc-bradbury.genlayer.com";
const CONTRACT = process.env.COURT_CONTRACT ?? "0x31F0bF694055e2b63ACEF4B010F7F7d7488AEee0";
const FIXTURE_BASE = process.env.COURT_FIXTURE_BASE ?? "https://raw.githubusercontent.com/Manablaq/agentlease-court-fixtures/live6-smoke-20260911";
const DELIVERY_FILE = process.env.COURT_DELIVERY_FILE ?? "live8-approved-delivery.json";
const VERIFICATION_FILE = process.env.COURT_VERIFICATION_FILE ?? "live8-approved-verification.json";
const CHALLENGE_FILE = process.env.COURT_CHALLENGE_FILE ?? "live8-short-challenge.json";
let JOB_ID = process.env.COURT_JOB_ID === undefined ? null : BigInt(process.env.COURT_JOB_ID);

const ownerKey = process.env.COURT_OWNER_PRIVATE_KEY ?? await keytar.getPassword("genlayer-cli", "account:worker");
const providerKey = process.env.COURT_PROVIDER_PRIVATE_KEY ?? await keytar.getPassword("genlayer-cli", "account:vg-provider-0e2855d");
if (!ownerKey || !providerKey) throw new Error("Set COURT_OWNER_PRIVATE_KEY and COURT_PROVIDER_PRIVATE_KEY or configure the GenLayer CLI accounts");

const owner = createAccount(ownerKey);
const provider = createAccount(providerKey);
const ownerClient = createClient({ chain: testnetBradbury, endpoint: RPC, account: owner });
const providerClient = createClient({ chain: testnetBradbury, endpoint: RPC, account: provider });
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function submit(client, functionName, args, value = 0n) {
  const account = client.account;
  const callData = abi.calldata.encode(abi.calldata.makeCalldataObject(functionName, args));
  const serialized = abi.transactions.serialize([callData, false]);
  const addAbi = testnetBradbury.consensusMainContract.abi.find((item) => item.type === "function" && item.name === "addTransaction");
  const validUntil = BigInt(Math.floor(Date.now() / 1000) + 3600);
  const data = encodeFunctionData({
    abi: [addAbi],
    functionName: "addTransaction",
    args: [account.address, CONTRACT, 3n, 5n, serialized, validUntil],
  });
  const nonce = await client.getCurrentNonce({ address: account.address });
  const gasPrice = BigInt(await client.request({ method: "eth_gasPrice" }));
  const signed = await account.signTransaction({
    account,
    to: testnetBradbury.consensusMainContract.address,
    data,
    type: "legacy",
    nonce: Number(nonce),
    value,
    gas: 2_000_000n,
    gasPrice,
    chainId: testnetBradbury.id,
  });
  const evmHash = await client.sendRawTransaction({ serializedTransaction: signed });
  let receipt = null;
  for (let poll = 0; poll < 60 && !receipt; poll += 1) {
    receipt = await client.request({ method: "eth_getTransactionReceipt", params: [evmHash] });
    if (!receipt) await sleep(2000);
  }
  if (!receipt || receipt.status !== "0x1") throw new Error(`EVM envelope failed: ${evmHash}`);
  const events = parseEventLogs({ abi: testnetBradbury.consensusMainContract.abi, eventName: "NewTransaction", logs: receipt.logs });
  if (!events.length) throw new Error(`No GenLayer transaction event: ${evmHash}`);
  return events[0].args.txId;
}

async function execute(label, client, functionName, args, value = 0n) {
  const hash = await submit(client, functionName, args, value);
  const transaction = await acceptedTransaction(label, client, hash);
  if (transaction.txExecutionResultName === "FINISHED_WITH_ERROR" || transaction.txExecutionResultName === "NOT_VOTED") {
    throw new Error(`${label} failed: ${hash} (${transaction.statusName}/${transaction.txExecutionResultName})`);
  }
  console.log(`${label}: ${hash} ${transaction.statusName}/${transaction.txExecutionResultName}/${transaction.resultName ?? ""}`);
  return { hash, transaction };
}

async function acceptedTransaction(label, client, hash) {
  for (let attempt = 1; attempt <= 12; attempt += 1) {
    try {
      await client.waitForTransactionReceipt({ hash, status: "ACCEPTED", retries: 240, interval: 5000 });
      return await client.getTransaction({ hash });
    } catch (error) {
      if (attempt === 12) throw error;
      console.log(`${label}: temporary RPC read failure; retrying transaction ${hash}`);
      await sleep(5000);
    }
  }
  throw new Error(`could not read accepted transaction ${hash}`);
}

async function expectFailure(label, client, functionName, args, value = 0n) {
  const hash = await submit(client, functionName, args, value);
  const transaction = await acceptedTransaction(label, client, hash);
  if (transaction.txExecutionResultName !== "FINISHED_WITH_ERROR") {
    throw new Error(`${label} unexpectedly succeeded: ${hash}`);
  }
  console.log(`${label}: ${hash} rejected as expected`);
  return { hash, transaction };
}

async function resolveWithRetry(label, client, attempts = 3) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const hash = await submit(client, "resolve_job", [JOB_ID]);
    const transaction = await acceptedTransaction(`${label} attempt ${attempt}`, client, hash);
    console.log(`${label} attempt ${attempt}: ${hash} ${transaction.statusName}/${transaction.txExecutionResultName}/${transaction.resultName ?? ""}`);
    if (transaction.txExecutionResultName === "FINISHED_WITH_RETURN") return { hash, transaction };
    if (transaction.statusName !== "LEADER_TIMEOUT" && transaction.txExecutionResultName !== "NOT_VOTED") {
      throw new Error(`${label} failed: ${hash} (${transaction.statusName}/${transaction.txExecutionResultName})`);
    }
  }
  throw new Error(`${label} exhausted ${attempts} attempts after leader timeouts`);
}

async function read(functionName, args) {
  const original = console.error;
  try {
    console.error = () => {};
    return await ownerClient.readContract({ address: CONTRACT, functionName, args });
  } finally {
    console.error = original;
  }
}

async function findNextJobId() {
  for (let candidate = 1n; candidate < 10000n; candidate += 1n) {
    try {
      await read("get_job", [candidate]);
    } catch {
      return candidate;
    }
  }
  throw new Error("could not find an unused job ID; set COURT_JOB_ID explicitly");
}

async function fixture(file) {
  const uri = `${FIXTURE_BASE}/${file}`;
  const response = await fetch(uri);
  if (!response.ok) throw new Error(`fixture ${response.status}: ${uri}`);
  const body = await response.text();
  return { uri, body, bodyHash: createHash("sha256").update(body).digest("hex"), record: JSON.parse(body) };
}

async function ensurePublisher(record, label) {
  try {
    await read("get_publisher", [record.publisher_id]);
    return null;
  } catch {
    return execute(`register ${label} publisher`, ownerClient, "register_publisher", [
      record.publisher_id,
      record.source_group,
      `${FIXTURE_BASE}/`,
      record.publisher_key_id,
    ]);
  }
}

function number(value) {
  return typeof value === "bigint" ? Number(value) : Number(value);
}

const delivery = await fixture(DELIVERY_FILE);
const verification = await fixture(VERIFICATION_FILE);
const challenge = await fixture(CHALLENGE_FILE);
const txs = {};

if (JOB_ID === null) JOB_ID = await findNextJobId();
console.log(`using fresh job ID ${JOB_ID}`);

txs.deliveryPublisher = await ensurePublisher(delivery.record, "delivery");
txs.verificationPublisher = await ensurePublisher(verification.record, "verification");
txs.create = await execute("create funded job", ownerClient, "create_job", [
  provider.address,
  "API reliability audit",
  "Approve only when the delivery is complete, the verification is corroborated, and both records satisfy the requested API reliability audit criteria.",
  3600n,
], 1_000_000_000_000_000n);
txs.delivery = await execute("submit delivery", providerClient, "submit_delivery", [
  JOB_ID,
  delivery.uri,
  delivery.bodyHash,
  delivery.record.publisher_id,
  delivery.record.record_id,
  BigInt(delivery.record.version),
  BigInt(delivery.record.published_at),
  BigInt(delivery.record.valid_until),
  verification.uri,
  verification.bodyHash,
  verification.record.publisher_id,
  verification.record.record_id,
  BigInt(verification.record.version),
  BigInt(verification.record.published_at),
  BigInt(verification.record.valid_until),
]);
txs.start = await execute("start review", ownerClient, "start_review", [JOB_ID]);
txs.firstResolve = await resolveWithRetry("first resolve", ownerClient);
let state = await read("get_job", [JOB_ID]);
if (number(state.decision) !== 1 || number(state.confidence) !== 9500 || !state.consensus_bound || state.reason_code !== "criteria_satisfied") {
  throw new Error(`first resolve did not produce the expected approved verdict: ${JSON.stringify(state)}`);
}

txs.challengePublisher = await ensurePublisher(challenge.record, "challenge");
txs.challenge = await execute("submit challenge", providerClient, "submit_challenge", [
  JOB_ID,
  challenge.uri,
  challenge.bodyHash,
  challenge.record.publisher_id,
  challenge.record.record_id,
  BigInt(challenge.record.version),
  BigInt(challenge.record.published_at),
  BigInt(challenge.record.valid_until),
  "Requesting a second review of the completed audit.",
]);
txs.challengedStart = await execute("start challenged review", ownerClient, "start_review", [JOB_ID]);
txs.secondResolve = await resolveWithRetry("second resolve", ownerClient);
state = await read("get_job", [JOB_ID]);
if (number(state.resolution_count) !== 2 || number(state.evidence_revision) !== 2 || state.challenge_uri !== challenge.uri || number(state.decision) !== 1 || !state.consensus_bound) {
  throw new Error(`challenged resolve did not preserve the expected verdict and evidence revision: ${JSON.stringify(state)}`);
}

txs.duplicateChallenge = await expectFailure("duplicate challenge", providerClient, "submit_challenge", [
  JOB_ID,
  challenge.uri,
  challenge.bodyHash,
  challenge.record.publisher_id,
  challenge.record.record_id,
  BigInt(challenge.record.version),
  BigInt(challenge.record.published_at),
  BigInt(challenge.record.valid_until),
  "duplicate",
]);
txs.earlyFinalize = await expectFailure("early finalization", ownerClient, "finalize_job", [JOB_ID]);
state = await read("get_job", [JOB_ID]);
const deadline = number(state.challenge_deadline);
while (Math.floor(Date.now() / 1000) < deadline + 5) {
  const remaining = deadline + 5 - Math.floor(Date.now() / 1000);
  console.log(`waiting for active challenge deadline: ${remaining}s`);
  await sleep(Math.min(30000, Math.max(1000, remaining * 1000)));
}
txs.finalize = await execute("finalize approved job", ownerClient, "finalize_job", [JOB_ID]);
state = await read("get_job", [JOB_ID]);
if (number(state.status) !== 6 || !state.consensus_bound) throw new Error("finalization did not produce provider-payout status");
txs.withdraw = await execute("provider withdraws payout", providerClient, "withdraw_payout", [JOB_ID]);
state = await read("get_job", [JOB_ID]);
const canWithdraw = await read("can_withdraw", [JOB_ID, provider.address]);
const isFinal = await read("is_final", [JOB_ID]);
if (number(state.status) !== 8 || !state.withdrawn || canWithdraw || !isFinal) throw new Error("payout assertions failed");

console.log(JSON.stringify({
  contract: CONTRACT,
  fixtureBase: FIXTURE_BASE,
  jobId: JOB_ID.toString(),
  sourceHashes: { delivery: delivery.bodyHash, verification: verification.bodyHash, challenge: challenge.bodyHash },
  finalState: Object.fromEntries(Object.entries(state).map(([key, value]) => [key, typeof value === "bigint" ? value.toString() : value])),
  txs: Object.fromEntries(Object.entries(txs).map(([key, value]) => [key, value && value.hash ? value.hash : value])),
}, null, 2));
