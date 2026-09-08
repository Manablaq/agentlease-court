# AgentLease Court

AgentLease Court is a GenLayer Intelligent Contract for client-funded agent
and API work. A client locks GEN against a job, a provider submits a delivery,
and two independently registered evidence publishers support a consensus-backed
decision against the job's acceptance criteria. Approved work becomes payable to
the provider; rejected, ambiguous, failed, cancelled, or expired work remains
refundable to the client.

This repository contains a standalone Intelligent Contract, an identical Studio
copy, pure regression tests, a deployment runbook, an evidence specification,
and a security model. There is intentionally no frontend, application server,
or UI dependency: custody, authorization, evidence binding, consensus review,
finalization, and withdrawals are contract-level behavior. The current Bradbury
deployment is `0x7DC2037751d2eea395A92fb7d9865AB1D9DcC299`; the earlier
deployment at `0xebEf03d3074DE546Fd402f0A3AdD881fd5EEcaDb` used placeholder
authorities and is superseded. Live testing now covers funded escrow,
provider-only delivery, authority-bound evidence retrieval, consensus review,
third-source challenge, fresh post-challenge review, finalization, and provider
withdrawal. Short-window Bradbury runs now cover both full settlement outcomes:
an approved provider payout and a rejected client refund. The original
long-window job remains an earlier review-state record.

## Contract-only architecture

The contract is the application. It owns the job state machine and escrow,
enforces publisher authority boundaries, performs the non-deterministic evidence
review, requires independent validator agreement, and exposes read/write
methods for any compatible client. Off-chain evidence publishers and the
deployment/test tooling are integration boundaries, not trusted application
logic and not required for the contract to preserve its safety properties.

## Why GenLayer is necessary

Ordinary escrow can enforce who may call a method and where funds go, but it
cannot independently judge whether a natural-language delivery satisfies an
acceptance rubric using live evidence. AgentLease Court puts that judgment in a
non-deterministic block and asks validators to independently repeat it. The
contract stores only a small canonical result: `approved`, `rejected`,
`needs_review`, or `error`.

## Lifecycle

```text
register publisher authorities
        -> create funded job
        -> provider submits two distinct evidence references
        -> participant starts review
        -> leader + validators evaluate the pinned evidence
        -> optional challenge and fresh review
        -> finalize after the challenge window
        -> provider payout or client refund
```

### Contract API

Governance:

- `register_publisher(publisher_id, source_group, publisher_uri, key_id)`
- `set_publisher_active(publisher_id, active)`
- `get_publisher(publisher_id)`

Job lifecycle:

- `create_job(provider, title, acceptance_criteria, delivery_ttl_seconds)` — payable; the exact `GEN` value becomes escrow.
- `submit_delivery(...)` — provider submits delivery and independent verification records.
- `accept_job(job_id)` — client accepts without adjudication and makes provider funds withdrawable.
- `start_review(job_id)` — participant opens the consensus review phase.
- `resolve_job(job_id)` — performs live evidence retrieval and independent validator re-evaluation.
- `submit_challenge(...)` — participant adds third-source counter-evidence during the review window.
- `finalize_job(job_id)` — closes the challenge window and selects provider payout or client refund.
- `cancel_job(job_id)` — client cancels before delivery.
- `recover_expired(job_id)` — converts an expired unresolved job to a client refund.
- `withdraw_payout(job_id)` — entitled party withdraws exactly once.

Views:

- `get_job(job_id)`
- `can_withdraw(job_id, account)`
- `is_final(job_id)`

## Evidence and provenance

Each publisher is registered to a safe HTTPS authority, source group, and key
identifier. Submitted URLs must use the registered origin and exact or
descendant path. Ports, credentials, query strings, fragments, percent
encoding, Unicode hostnames, and path traversal are rejected.

Each evidence URL must serve JSON with this shape:

```json
{
  "record_id": "job-1-delivery",
  "publisher_id": "provider-records",
  "publisher_key_id": "provider-key-2026-01",
  "source_group": "provider",
  "version": 1,
  "published_at": 1788900000,
  "valid_until": 1788986400,
  "signature": "publisher-signature-artifact",
  "signed_payload_hash": "sha256-of-canonical-record-with-detached-fields-removed",
  "delivery_status": "complete",
  "acceptance_facts": ["all required files present"]
}
```

The contract pins the SHA-256 hash of the complete response body, then checks
the record identity, version, timestamps, publisher key id, non-empty signature
artifact, and canonical signed-payload hash during review. It also re-checks
publisher bindings inside the validator path. The URL rule is an authority
boundary; it is not a claim that a non-empty signature string is a valid
cryptographic signature.

## Safety properties

- Only the owner can register or disable publishers.
- Only the provider can submit delivery evidence.
- Only client/provider participants can accept, review, or challenge.
- Delivery and verification must come from different source groups and URLs.
- Validators independently re-run the evidence evaluation and compare only canonical fields.
- A review result cannot be settled until the challenge deadline passes.
- A payout can be withdrawn once, by the correct party, for the exact escrow amount.
- Failed or expired jobs default to a client refund path rather than silently paying the provider.
- Evidence records are treated as untrusted data; prompt-injection instructions are ignored.

## Verification

```bash
npm run verify
```

This checks Python syntax, deployable source parity, URL authority regression
cases, lifecycle surface, payable value custody, independent validator
re-evaluation, and prompt-safety invariants. Current Bradbury results are
recorded in `docs/DEPLOYMENT_LOG_BRADBURY.md`.

## Deployment policy

Deploy only `contracts/agentlease_court.py`. The file in
`studio_bradbury/agentlease_court.py` must remain byte-identical and is used for
Studio reproduction. Before any submission, record the exact source SHA-256,
deployment transaction, contract address, successful execution result, and a
full lifecycle test that includes at least one approved payout and one rejected
refund path. See [`docs/DEPLOYMENT_RUNBOOK_BRADBURY.md`](docs/DEPLOYMENT_RUNBOOK_BRADBURY.md).
