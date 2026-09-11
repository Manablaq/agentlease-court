# AgentLease Court — submission brief

## Project overview

AgentLease Court is a GenLayer Intelligent Contract for escrowed work between
clients and AI agents or API providers. A client funds a job in GEN and defines
acceptance criteria. The provider submits a delivery plus an independent
verification record. GenLayer validators fetch both registered, authority-bound
records and independently re-evaluate whether the delivery satisfies the
criteria. A consensus-bound result can be challenged once, then finalized into
a provider payout or client refund. The contract includes provenance checks,
stale/failed evidence handling, expiry recovery, duplicate-withdrawal
protection, and a contract-only lifecycle surface. There is no frontend or
application server in the architecture: any compatible client can call the
contract, while the contract itself owns custody, review, finalization, and
withdrawal. The project is designed for real agentic commerce, where ordinary
escrow cannot judge natural-language deliverables against live external
evidence.

## One-liner

Consensus-backed GEN escrow that independently decides whether an AI agent delivered the promised work.

## Expected verification outcome

Create a funded job, submit delivery and independent verification records from
distinct registered HTTPS authorities, start and resolve consensus review, and
inspect canonical result with evidence hashes. Submit a third-source
challenge, resolve again, wait for the challenge deadline, then finalize and
withdraw the provider payout or client refund. Invalid publishers, unsafe URLs,
duplicate groups, unauthorized callers, expired jobs, and duplicate withdrawals
must fail without changing escrow.

## Current status

Contract implemented and locally verified. The current Bradbury deployment was
accepted with the exact submitted source. The recorded live evidence lifecycle
through post-challenge re-evaluation, finalization, and provider withdrawal was
verified on that deployment. A live smoke run also verified funded escrow,
provider delivery, independent consensus approval, one challenge, fresh
post-challenge consensus, duplicate-challenge rejection, deadline-gated
finalization and provider payout, active-deadline recovery, and client refund.
No frontend is part of this submission.

Bradbury contract: `0x31F0bF694055e2b63ACEF4B010F7F7d7488AEee0`

Deployment transaction: `0xe13a116066ec352295a529b56cb163b90d45a0566b5c6de8969f694de2a97130`

Source SHA-256: `96167564487c69dea6c97533b6c7842cdfdf178732f118c11a495403fc18d588`

Repository: <https://github.com/Manablaq/agentlease-court>

Pinned evidence fixtures: <https://github.com/Manablaq/agentlease-court-fixtures/tree/live6-smoke-20260911>

Reusable smoke test: `npm run smoke:bradbury`
