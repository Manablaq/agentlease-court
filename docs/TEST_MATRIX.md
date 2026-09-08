# Verification matrix

| Area | Verification | Status |
|---|---|---|
| Python syntax | Compile both deployable source copies | Passing locally |
| Source parity | Byte comparison of contract and Studio copies | Passing locally |
| Publisher authority | Exact origin/path, traversal, query, fragment, credentials, and Unicode cases | Passing locally |
| Escrow entry | Payable method reads positive `gl.message.value` | Passing by static invariant test |
| Escrow exit | Entitled recipient only; one withdrawal; exact amount transfer | Passing by static invariant test |
| Authorization | Owner, client, provider, and participant boundaries present | Passing by static invariant test |
| Consensus | Leader plus independent validator re-evaluation | Passing by static invariant test |
| Prompt safety | External record content explicitly treated as untrusted | Passing by static invariant test |
| Local GenLayer runtime | Simulator deployment and transaction execution | Blocked outside the contract: startup succeeds with CLI-compatible images, but the simulator faucet fails while recording GEN-sized balances and `eth_getBalance` returns a nonstandard numeric result; no contract transaction was executed |
| Bradbury deployment | Exact source deployment and Explorer record | Passing: current deployment is `0x7DC2037751d2eea395A92fb7d9865AB1D9DcC299`; see deployment log |
| Bradbury deterministic lifecycle | Fund, authorization, cancel, exact refund, one-time settlement | Passing for job `1`; see deployment log |
| Bradbury evidence lifecycle | Deliver, consensus review, challenge, fresh review, finalize, provider payout, rejected refund | Passing: approved/challenged/provider-payout path on job `2` and rejected/client-refund path on job `3`; see deployment log |

The approved path's time-gated finalization and payout were verified after the
short fixture's registered validity window expired. The deterministic cancel /
refund path is separately passing for job `1`, and job `3` provides live
consensus-bound rejected evidence followed by client refund.
