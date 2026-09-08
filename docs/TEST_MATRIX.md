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
| Bradbury deployment | Exact source deployment and Explorer record | Passing: deployed at `0xebEf03d3074DE546Fd402f0A3AdD881fd5EEcaDb`; see deployment log |
| Bradbury deterministic lifecycle | Fund, authorization, cancel, exact refund, one-time settlement | Passing for job `1`; see deployment log |
| Bradbury evidence lifecycle | Deliver, consensus review, challenge, finalize, provider payout, rejected refund | Pending immutable public JSON fixtures |

The evidence lifecycle row is intentionally not marked passing until real
network evidence exists.
