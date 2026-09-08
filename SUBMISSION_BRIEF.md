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
distinct registered HTTPS authorities, start and resolve review, and inspect a
canonical approved/rejected/needs_review result with evidence hashes. Submit a
third-source challenge, resolve again, finalize after the challenge window, and
withdraw exactly one payout to the provider or refund to the client. Attempts
using an unregistered publisher, unsafe URL, duplicate source group,
unauthorized caller, expired job, or second withdrawal must fail without
changing the escrow outcome.

## Current status

Contract implemented and locally verified. Bradbury deployment and the
deterministic escrow/refund smoke test are verified; the evidence-review smoke
test remains pending immutable public fixtures. No frontend is part of this
submission.

Bradbury contract: `0xebEf03d3074DE546Fd402f0A3AdD881fd5EEcaDb`
