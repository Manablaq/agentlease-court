# Security model

## Trust boundaries

The client and provider control their calldata and may be adversarial. Evidence
records are also untrusted: their text can contain prompt-injection attempts,
incorrect claims, or stale data. The contract therefore treats the records as
data only and requires the consensus evaluator to follow the registered
acceptance criteria.

Publisher registration is the authority boundary. The owner registers a safe
HTTPS origin/path, source group, and key identifier. A delivery URL must be the
registered path or a descendant under the same origin. Ambiguous URL forms are
rejected before web access.

## Escrow invariants

1. `create_job` must receive a positive GEN value.
2. The provider must be non-zero and different from the client.
3. Only the provider may submit delivery evidence.
4. Delivery and independent verification must use distinct URLs, record ids,
   and source groups.
5. Only a consensus-bound result can be finalized.
6. Approved final results make the exact escrow amount payable to the provider.
7. Rejected, ambiguous, failed, cancelled, or expired jobs make the exact
   escrow amount refundable to the client.
8. `withdraw_payout` marks the job withdrawn before the transaction completes,
   and a second call is rejected by contract state.

## Consensus invariants

The leader fetches both pinned records and emits a small canonical result.
Validators independently repeat the same evaluation and compare the decision,
confidence, reason code, and all evidence hashes. Free-form summaries are
derived from the canonical decision and are not independently trusted.

If evidence cannot be fetched, parsed, provenance-checked, or hash-checked, the
result is a canonical error. The contract never silently converts a failed
evaluation into a provider payout.

## Known limitations

The `signature` field is required and its canonical payload hash is checked, but
this contract does not claim to implement asymmetric signature verification in
GenVM. Authentic publisher signatures must be verified by the publisher layer
or replaced with a future cryptographic verification primitive. The contract's
enforceable protection against impersonation is the registered HTTPS
origin/path rule plus complete-body hash pinning.

The payout uses an external native-GEN message to the entitled EOA. It is only
emitted after finalization through `withdraw_payout`; no payout is emitted from
the non-deterministic review path.
