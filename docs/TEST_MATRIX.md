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
| Bradbury deployment | Exact source deployment and Explorer record | Passing: `0x31F0bF694055e2b63ACEF4B010F7F7d7488AEee0`, deployment tx `0xe13a116066ec352295a529b56cb163b90d45a0566b5c6de8969f694de2a97130`, source SHA-256 `96167564487c69dea6c97533b6c7842cdfdf178732f118c11a495403fc18d588` |
| Bradbury deterministic lifecycle | Fund, authorization, active-deadline recovery, exact refund, one-time withdrawal | Passing on the current deployment: active challenge blocks early recovery; recovery after the active deadline produces a client refund |
| Bradbury evidence lifecycle | Deliver, consensus review, single challenge, fresh review, finalize, provider payout | Passing on the current deployment: 5/5 validators agreed on both reviews; duplicate challenge was rejected; finalization and provider withdrawal completed |
| Reusable Bradbury smoke | `npm run smoke:bradbury` | Checked: script is checked into `scripts/smoke_bradbury.mjs`, discovers the next job ID, retries consensus/RPC reads, and uses branch-matched fixture defaults; the complete current-deployment lifecycle is independently recorded above |

The approved path's time-gated finalization and payout were verified after the
active challenge deadline. The same current deployment also rejected early
recovery, then recovered the challenged job after the active deadline and paid
the client refund. The deployment log records the transaction IDs and final
read-back state for both live paths.
