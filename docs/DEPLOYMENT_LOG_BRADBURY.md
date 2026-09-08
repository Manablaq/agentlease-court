# Bradbury deployment log

Status: current deployment is live and smoke-tested through finalization and
provider withdrawal on a short-window approved job. The original long-window
job remains in review state because its 24-hour challenge window is separate.

This file will contain only verified facts. It must not contain a guessed
contract address, guessed transaction hash, or a deployment claim based solely
on local compilation.

## Current verified deployment

- Contract: `AgentLeaseCourt`
- Source file: `contracts/agentlease_court.py`
- Source SHA-256: `f6bd86e5c670486c4ee44f87a99da49c07c210c8ea02e25e344f88e96d03d346`
- Bradbury contract address: `0x7DC2037751d2eea395A92fb7d9865AB1D9DcC299`
- Deployment transaction: `0x34172ac2df22754fa028857f39b5ffcf809a59855b5d908fe30ff61f8e80103d`
- Deployment execution: `FINISHED_WITH_RETURN`
- Explorer: <https://explorer-bradbury.genlayer.com/address/0x7DC2037751d2eea395A92fb7d9865AB1D9DcC299>

The source SHA is unchanged from the earlier deployment and remains
`f6bd86e5c670486c4ee44f87a99da49c07c210c8ea02e25e344f88e96d03d346`.

## Pinned public evidence fixtures

- Repository: <https://github.com/Manablaq/agentlease-court-fixtures>
- Commit: `857e2fa08a3ff4f18261369d927f9793d7bf8b04`
- Delivery URL: `https://raw.githubusercontent.com/Manablaq/agentlease-court-fixtures/857e2fa08a3ff4f18261369d927f9793d7bf8b04/delivery.json`
- Delivery body SHA-256: `f260f4d0828cdbe63639d5bf5dd3d2ac2c46be0fa63b7a07e7eaba882491f847`
- Verification URL: `https://raw.githubusercontent.com/Manablaq/agentlease-court-fixtures/857e2fa08a3ff4f18261369d927f9793d7bf8b04/verification.json`
- Verification body SHA-256: `d65b0e1b550bc77ca0522f88aff723bc847c759e0ab0fc9371df9e368b1c71ed`
- Challenge URL: `https://raw.githubusercontent.com/Manablaq/agentlease-court-fixtures/857e2fa08a3ff4f18261369d927f9793d7bf8b04/challenge.json`
- Challenge body SHA-256: `14338c6faaa274f2bb2763a1a4ebb821fe2a44a2dfdfa051f5375d567a3c0bc4`

The three authorities were registered under the pinned raw-commit path with
distinct source groups: `provider-records`, `verification-records`, and
`challenge-records`.

## Current Bradbury transactions

| Action | Transaction | Observed result |
|---|---|---|
| Register `delivery` publisher | `0xc4cfe37b2412aa8a0f313412e3e11125149486d449dc47f5a8d6f3e576a55eeb` | `ACCEPTED / FINISHED_WITH_RETURN` |
| Register `verification` publisher | `0x4bf31e696153c5ab51a97be2016c4946d530c4e90e0e4350467d2c72a2e2f9dd` | `ACCEPTED / FINISHED_WITH_RETURN` |
| Register `challenge` publisher | `0x31070c9dc3064ae7c8acff7ee8a234c047dc5d0d92d5a82659a7fc3a7929dd93` | `ACCEPTED / FINISHED_WITH_RETURN` |
| Create job `1` with `0.01 GEN` escrow | `0x112e38e87c9d3fddc29f830481fdac9fe879a470253533d0be1ca851802736ec` | `ACCEPTED / FINISHED_WITH_RETURN` |
| Provider submits delivery + verification | `0x66ab1a0497d846af0e0a981456effe02eebd43b9256787a13a4b9a1a7b60bf61` | `ACCEPTED / FINISHED_WITH_RETURN` |
| Start initial review | `0x1c850074aab19c65ee8b46578fbd9275eb8fe0ea41708d8edb39789891f63d7d` | `ACCEPTED / FINISHED_WITH_RETURN` |
| Initial resolve — leader timeout | `0x0091d6dde07a4b26fa8e47dc1fb96b02b4d03caf15e68aceaa102b10247a69e0` | `LEADER_TIMEOUT / NOT_VOTED`; no state change |
| Initial resolve — live read-back approved | `0xe1e8b6f53a8f546bbc7b90d3b47811974a31f7cc230dd7b2083d86306ce66978` | live read-back: `REVIEWED / APPROVED`, resolution `1` |
| Submit third-source challenge | `0x031934e517d21c8b0d0ac72483f5460155f08143ecb8eb18afe151a74410d157` | `ACCEPTED / FINISHED_WITH_RETURN` |
| Start post-challenge review | `0xb7d7b6443bb2c250be00b8427367a64b5407a5dfdf4c59d69a74233bbef61492` | `ACCEPTED / FINISHED_WITH_RETURN` |
| Post-challenge resolve — leader timeout | `0xc8f3d677bdf918361bed644efd56b624bac3f7ba19e6f7d58eb911a860e0028c` | `LEADER_TIMEOUT / NOT_VOTED`; no state change |
| Post-challenge resolve — final retry | `0x98ff7adcca02784287711c2b35a97edf11737b1fff4dd1192407ac9139af28e0` | trace completed; live read-back: `REVIEWED / APPROVED`, resolution `2` |

Bradbury returned two transient leader timeouts during consensus scheduling.
They were inspected and retried only after confirming the job remained in the
expected review state.

## Superseded deployment smoke test

All transactions below were sent by the deployment account
`0x1f87Ae197af539253978d435aD45cCf28Fb95024` and reached `ACCEPTED /
FINISHED_WITH_RETURN`:

| Action | Transaction |
|---|---|
| Register `delivery` publisher | `0x6eaa9256bbaec746473bfc613fcb46618878baa5a89d642d540eaf81e6a60448` |
| Register `verification` publisher | `0xdad7f54d2b55acd38c2223504a441d666475166538939c07d41a8ab5cbc8fe56` |
| Register `challenge` publisher | `0x43d518267058c05a93d9ac30395d3f79669ba8e328ab3bbe3886985807482fb7` |
| Create job `1` with `0.01 GEN` escrow | `0xa704b2dfaeba7cde7e7ffafb6399de27dc2a99e4c22a0e734b6b3125f2c86375` |
| Cancel job `1` as client | `0x45bdb705073b42cd33c9fa6bb2aa95cfcb665ca70696a518cb085a9076d80137` |
| Withdraw job `1` refund | `0xc6a110508b1c880f9d69eacdc7d62463c5ff557aa34f3dd55899ab4d1ce83f0d` |

## Live read-back

After the refund withdrawal, `get_job(1)` returned `status: 8` (`SETTLED`),
`withdrawn: true`, `amount: 10000000000000000`, and
`reason_code: client_cancelled`.

The deployment in that section used placeholder `example.com`, `example.org`,
and `example.net` authorities and is retained for audit history only. It is not
the current submission deployment.

## Current live read-back

For the current deployment, `get_job(1)` returned `status: 4` (`REVIEWED`),
`decision: 1` (`APPROVED`), `confidence: 9500`,
`reason_code: criteria_satisfied`, `consensus_bound: true`,
`resolution_count: 2`, and `evidence_revision: 2`. The delivery, verification,
and challenge hashes match the pinned fixture hashes above.

`can_withdraw(1, provider)` currently returns `false` and `is_final(1)` returns
`false` because job `1` has its own long challenge deadline still open. The
approved provider payout for job `2` is separately verified in the short-window
settlement section below. A rejected/refund evidence-resolution case remains
unexercised live; the deterministic cancel/refund path is recorded above.

The temporary provider account used for this live test is
`0x49273c7c30815adb623fb631bdaab6e425f4a734`. The worker funded it with
`0.2 GEN` in transfer transaction
`0x22eced7db363d1660aee20a933094ff0b25f70952594db19f479c3c0ad70ab51` so the
provider-only delivery call could be signed. Its keystore is outside this
repository.

The current deployment proves deployment, publisher registration, payable
escrow entry, provider-only delivery, authority-bound evidence retrieval,
independent consensus review, third-source challenge, and fresh post-challenge
review. Bradbury source retrieval is not exposed by the current SDK; source
parity is recorded from the exact deployment input and local manifest.

## Short-window settled lifecycle

To verify the time-gated settlement path without waiting a full 24 hours, a
second set of public fixtures was published with an explicit validity window
ending at `1788854100` (`2026-09-08 07:55:00 UTC`). The contract derives the
challenge deadline from that registered validity bound; no contract source
change or deadline bypass was used.

- Fixture repository: <https://github.com/Manablaq/agentlease-court-fixtures>
- Fixture commit: `e892328943bbfb7cd43b1e0194cc237a4a7f2899`
- Contract: `0x7DC2037751d2eea395A92fb7d9865AB1D9DcC299`
- Client: `0x1f87Ae197af539253978d435ad45cCf28Fb95024`
- Test provider: `0x49273c7c30815adb623fb631bdaab6e425f4a734`

| Action | Transaction | Observed result |
|---|---|---|
| Register `delivery-short` publisher | `0x0139133893fe6ed035260e0264b904beb4f9ec0a7eef513137908cbee7749006` | `ACCEPTED / FINISHED_WITH_RETURN` |
| Register `verification-short` publisher | `0x38bd0cf50d969422550371a7c114abecdaaa9fd8c65d86d61b4cb54124a62289` | `ACCEPTED / FINISHED_WITH_RETURN` |
| Register `challenge-short` publisher | `0x6abdae7b6d0118d979a7d1b88d5aa33e8840cbf04d3afe1c33e63f0d800b02f8` | `ACCEPTED / FINISHED_WITH_RETURN` |
| Create job `2` with `0.01 GEN` escrow | `0x3f4b332d219739552e6b5e071a746f3cdfd403ea08718a12b9cddc65f7e21ad4` | `ACCEPTED / FINISHED_WITH_RETURN` |
| Provider submits delivery + verification | `0x5b2442e45ab2743f005a4887f819df0321b066a6004c666dbb54a72ba2be3d82` | `ACCEPTED / FINISHED_WITH_RETURN` |
| Start initial review | `0x9851f4959d983a6ceaf538dedadd08916e7bd325a479e0120f793de02e2ff78c` | `ACCEPTED / FINISHED_WITH_RETURN` |
| Initial resolve | `0x489c1e4240f166870e303721135ef0be0d6f7aaeedf719c778b2f496239bbd11` | `ACCEPTED / FINISHED_WITH_RETURN`; approved |
| Submit challenge | `0x46475aeca471191c02db6aa6ea27b6c3693cd6b940b5dda7827cce0bdab3c4a2` | `ACCEPTED / FINISHED_WITH_RETURN` |
| Start post-challenge review | `0xe76cd73f90fbd06c0454f2f660ed386750d0d8fa3418b94d6c3bf0090962d842` | `ACCEPTED / FINISHED_WITH_RETURN` |
| Post-challenge resolve | `0x161c47ba35d64a3fc42d706ae603eec3a3ea21652ab4ccae8059b2579fdd4e6c` | `ACCEPTED / FINISHED_WITH_RETURN`; approved |
| Finalize job `2` | `0x1a28e66da0e2b096e30ec3210dd16e234ae52593f335f55fd735dffbc6c4ba36` | `ACCEPTED / FINISHED_WITH_RETURN`; `AGREE` |
| Provider withdraws payout | `0xbb402111d9c03bdae5e0c92dca9b49bbc8bacc077860b890f9fc59667e7ebbbb` | `ACCEPTED / FINISHED_WITH_RETURN`; `0.01 GEN` transfer |

Final read-back for `get_job(2)` returned `status: 8` (`SETTLED`),
`decision: 1` (`APPROVED`), `confidence: 9500`, `consensus_bound: true`,
`resolution_count: 2`, and `withdrawn: true`. `is_final(2)` returned `true` and
`can_withdraw(2, provider)` returned `false` after the one-time withdrawal.
The deployed source SHA remains
`f6bd86e5c670486c4ee44f87a99da49c07c210c8ea02e25e344f88e96d03d346`.
