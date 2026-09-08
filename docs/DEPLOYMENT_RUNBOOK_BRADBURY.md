# Bradbury deployment runbook

This runbook is verification-first. Do not publish a contract address or
submit the project until every item is backed by a recorded result.

## 1. Local checks

From the repository root:

```bash
npm run verify
```

Confirm that `contracts/agentlease_court.py` and
`studio_bradbury/agentlease_court.py` are byte-identical.

## 2. Prepare Bradbury

Use the current GenLayer Bradbury SDK/client and the account intended for the
deployment. Ensure that the account can cover the protocol fee plus the test
escrow value. The user value sent to `create_job` is separate from the fee
deposit.

Print the source manifest before deployment:

```bash
npm run source:manifest
```

The repository includes this convenience command for the current CLI:

```bash
npm run deploy:bradbury
```

The command submits the contract deployment only. It does not register
publishers, create jobs, or claim that deployment succeeded; record the CLI
result and inspect the transaction receipt separately.

## 3. Required lifecycle smoke test

Register three publisher authorities on distinct source groups. Exercise:

1. funded job creation;
2. provider-only delivery submission;
3. client/provider review start;
4. consensus resolution with two source records;
5. challenge with a third source group;
6. fresh resolution after challenge;
7. finalization after the challenge deadline;
8. provider payout withdrawal for an approved job;
9. a separate rejected/ambiguous job ending in client refund;
10. duplicate withdrawal and unauthorized caller rejection.

Record every accepted transaction id and its final execution result. An
accepted transaction with `FINISHED_WITH_ERROR` is a failed application action,
not a passing smoke test. If Bradbury reaches a validator timeout, inspect the
trace and wait for the protocol window before retrying; do not blindly submit a
duplicate live action.

## 4. Submission evidence

The eventual submission should link to the repository, exact contract source,
deployment log, live demo, Bradbury explorer address, and a reproducible test
path. The repository source and deployed source must match exactly.
