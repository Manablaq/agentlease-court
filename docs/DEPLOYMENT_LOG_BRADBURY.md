# Bradbury deployment log

Status: the current deployment is live and accepted with the exact submitted
source. The current deployment has completed the approved, challenged,
finalized, provider-payout, active-deadline-recovery, client-refund, and
duplicate-challenge checks on Bradbury.

This file will contain only verified facts. It must not contain a guessed
contract address, guessed transaction hash, or a deployment claim based solely
on local compilation.

## Current verified deployment

- Contract: `AgentLeaseCourt`
- Source file: `contracts/agentlease_court.py`
- Source SHA-256: `96167564487c69dea6c97533b6c7842cdfdf178732f118c11a495403fc18d588`
- Bradbury contract address: `0x31F0bF694055e2b63ACEF4B010F7F7d7488AEee0`
- Deployment transaction: `0xe13a116066ec352295a529b56cb163b90d45a0566b5c6de8969f694de2a97130`
- Deployment execution: `FINISHED_WITH_RETURN`
- Explorer: <https://explorer-bradbury.genlayer.com/address/0x31F0bF694055e2b63ACEF4B010F7F7d7488AEee0>

The accepted deployment payload contains the same 20,213-byte source as
`contracts/agentlease_court.py`; its SHA-256 is
`96167564487c69dea6c97533b6c7842cdfdf178732f118c11a495403fc18d588`.

The transaction reached `ACCEPTED / AGREE` with execution result
`FINISHED_WITH_RETURN`. The deployed source was read back from Bradbury with
the SDK and matched the local source hash. It contains the documented direct
web and prompt APIs and no legacy nondeterministic aliases.

## Current deployment Bradbury lifecycle

The live run used fixture branch `live4-smoke-20260911`, commit
`f3f8e4f`, from the public fixture repository. The delivery and verification
body hashes were `3d4ef52b06660620f04246b006e96344d72e612e5c02f10bcb7ae99fd0eb686f`
and `862e7669d96af38e5ebedc11f52c2937fbfad0b71b660da1bbb3df5c84fbc3cd`.
The final short challenge body hash was
`2a7610b76daf2e4f6d215503b725ad80b2939da52d03b41e0f04e35b274d6b55`.

| Action | Transaction | Observed result |
|---|---|---|
| Register delivery publisher | `0xbc06713a61cae4831926cbf99e758ee776e34976d134df9324fabd1c06ec1e20` | `ACCEPTED / FINISHED_WITH_RETURN` |
| Register verification publisher | `0xb5491c814968aabf5b63f3df7b875cdbe220db5bfb67e0d473b51ba5adcfd771` | `ACCEPTED / FINISHED_WITH_RETURN` |
| Create job `1` with `0.001 GEN` escrow | `0xfcaa62f030a2ffee3b4f6725e10a17307a331abccc0cc313ad75d6e69cc5636e` | `ACCEPTED / FINISHED_WITH_RETURN` |
| Provider submits delivery + verification | `0x1470499a6f7c1bd99513bf55f3da9dd733b2c909f45952854788d762ea0a738a` | `ACCEPTED / FINISHED_WITH_RETURN` |
| Start initial review | `0x8b4148f6aceb314773fccf5b31f06cb6d248d38eb989d5587593bed7979feb78` | `ACCEPTED / FINISHED_WITH_RETURN` |
| Initial resolve | `0x1f36f2e1c27929600974eff53b9ff47223134c0a7079651434c3c8bc8672273c` | `ACCEPTED / FINISHED_WITH_RETURN`; 5/5 validators `AGREE`; approved |
| Register challenge publisher | `0xc7de76b068f2c154f091c89099cd9dd322b0576e89354c693c91f77b82f17849` | `ACCEPTED / FINISHED_WITH_RETURN` |
| Submit third-source challenge | `0x1fc30a5c93ea192951245ac093dc6c39f6564850f0504092e9434c7cc9ab4fb7` | `ACCEPTED / FINISHED_WITH_RETURN` |
| Start post-challenge review | `0x8ea108ee8eee985c8ff3e5af2ff944d12b234a90d20a5fbb37b64a908197fbd2` | `ACCEPTED / FINISHED_WITH_RETURN` |
| Post-challenge resolve | `0x609d593155d49649091c02a21096bb1aaa0a50a1accfca4160d2eca4f2e22bc4` | `ACCEPTED / FINISHED_WITH_RETURN`; 5/5 validators `AGREE`; approved |
| Duplicate challenge attempt | `0xdd3832006cc1c47232a82b7608c35d3c610244f0a1cc63f2b13824ebf243223a` | `FINISHED_WITH_ERROR`; rejected |
| Finalize job `1` after active deadline | `0x18b6b8687f8ac9562d7eaf61723d8d9e5c307298d9db8a2c0a09d8539ad1e5b6` | `ACCEPTED / FINISHED_WITH_RETURN`; provider payout status |
| Provider withdraws payout | `0xb1998fd54f1eca3e5030c3fa49246e60cd47335a62e6c38fe62922e7d475d682` | `ACCEPTED / FINISHED_WITH_RETURN` |

Final read-back for job `1` returned `status: 8`, `decision: 1`,
`confidence: 9500`, `reason_code: criteria_satisfied`, `resolution_count: 2`,
`evidence_revision: 2`, `consensus_bound: true`, and `withdrawn: true`.
`can_withdraw(1, provider)` returned `false` and `is_final(1)` returned `true`.
This run completed the initial and post-challenge evaluations with independent
leader re-evaluation and unanimous validator agreement.

The reusable smoke command defaults to the refreshed fixture branch
`live6-smoke-20260911` at commit
`3a717cd9e047e2deb80cf43bd2990ee166224975`. Its branch-matched fixture body
hashes are `b4363b01cc2086d6608b3743cd9d16fab30dff040e2579354dcd4a34a61dea80`
for delivery, `2c4b373e30f170a04d8fe4c58eef8083d7e04a426c8091571b2dd71ba4ce9728`
for verification, and
`d94d4d23ae5f600e4563fcb55b53b5694b04b37dbe5b7fd4cf639339ee38aaa3` for the
challenge. They are separate from the already completed live job records
above.

## Current deployment active-deadline recovery

Job `2` on the same final deployment verified the recovery rule after a
challenge was active. The challenge submission used the registered short
challenge fixture with a shorter submitted validity bound to create a controlled
deadline. The contract rejected recovery before that deadline, then refunded
after it expired.

| Action | Transaction | Observed result |
|---|---|---|
| Create job `2` with `0.001 GEN` escrow | `0xf0e83b52ea1e7b94a176af62cf7d97d1bb2ec5cb9e28728ecfd90ab96d4b0b08` | `ACCEPTED / FINISHED_WITH_RETURN` |
| Provider submits delivery + verification | `0xea2e917c3c7e6c87039842b6903f7cb4260f625d1dd2ee1e1f234dff88c05629` | `ACCEPTED / FINISHED_WITH_RETURN` |
| Start review | `0x61d451cec3a7c25e25c05c83beecd182c08b7a2491ed0834d31c6d36ab935bf2` | `ACCEPTED / FINISHED_WITH_RETURN` |
| Resolve review | `0x0c5491fc919e6caf95b81d068dafcd41c7023026bfad37f99d5206f758a2b101` | initial attempt was `NOT_VOTED`; job remained in review |
| Resolve review retry | `0xfe444f437b7fcbabb79f60c8ecd98c5e64573d8681b7ab532dd94a53d8cdf282` | `ACCEPTED / FINISHED_WITH_RETURN`; approved |
| Submit challenge | `0x65c3cb41c54781cc929561878bf604f74a1ec56b8d6b0abe6a4944e37c0fb4eb` | `ACCEPTED / FINISHED_WITH_RETURN` |
| Early recovery attempt | `0x939ed6e370a7ce85497677fcc9b6a201521a0190e690d8dbbcbe36c03858c0c1` | `FINISHED_WITH_ERROR`; deadline still active |
| Recover after active challenge deadline | `0x1c5145c27e4b3a7141dfed636427f716836cbcbcad99455b3e3b54393cf74f3a` | `ACCEPTED / FINISHED_WITH_RETURN`; `expired_refund` |
| Client withdraws refund | `0x04b7d02ce488cdbf22e2f48353efca31a32572b9d494ce5a98da3d0a0f8ce438` | `ACCEPTED / FINISHED_WITH_RETURN` |

Final read-back for job `2` returned `status: 8`, `reason_code: expired_refund`,
and `withdrawn: true`. This confirms that recovery follows the active
`challenge_deadline` and returns the escrow to the client.

## Historical deployments and fixture runs

The sections below belong to superseded deployments and remain audit history.

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

## Superseded deployment Bradbury lifecycle transactions

The following lifecycle transactions were executed against the superseded
deployment `0x7DC2037751d2eea395A92fb7d9865AB1D9DcC299`.

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

## Superseded deployment live read-back

For the superseded deployment, `get_job(1)` returned `status: 4` (`REVIEWED`),
`decision: 1` (`APPROVED`), `confidence: 9500`,
`reason_code: criteria_satisfied`, `consensus_bound: true`,
`resolution_count: 2`, and `evidence_revision: 2`. The delivery, verification,
and challenge hashes match the pinned fixture hashes above.

`can_withdraw(1, provider)` currently returns `false` and `is_final(1)` returns
`false` because job `1` has its own long challenge deadline still open. The
approved provider payout for job `2` and rejected client refund for job `3` are
separately verified in the short-window sections below.

The temporary provider account used for this live test is
`0x49273c7c30815adb623fb631bdaab6e425f4a734`. The worker funded it with
`0.2 GEN` in transfer transaction
`0x22eced7db363d1660aee20a933094ff0b25f70952594db19f479c3c0ad70ab51` so the
provider-only delivery call could be signed. Its keystore is outside this
repository.

That deployment proves publisher registration, payable escrow entry,
provider-only delivery, authority-bound evidence retrieval, independent
consensus review, third-source challenge, and fresh post-challenge review.
Bradbury source retrieval is not exposed by the current SDK; source parity for
the current deployment is recorded above from the exact deployment input and
local manifest.

## Superseded deployment short-window settled lifecycle

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

## Superseded deployment short-window rejected/refund lifecycle

A second short-window run used deliberately contradictory acceptance criteria
to exercise the consensus-bound rejected outcome and client refund. The fresh
records were published at fixture commit
`7330f6ce3c660a7cfda9cef5afc2350c1a742668` with a validity window ending at
`1788855300` (`2026-09-08 08:15:00 UTC`). The exact body hashes were
`b06085b857681c085b986dbdc61e7b83bc9983d42a6e95be28f14164274cc624` for
delivery and `865b87869bbb9109c1d08c655110cee3ef1a8add60010af9b482935dc7703c12`
for verification.

| Action | Transaction | Observed result |
|---|---|---|
| Register `delivery-rejected-2` publisher | `0x6c923139ac1a66c32627bfeb138dc6951f31d06b6e35fe987391a67814cabd77` | `ACCEPTED / FINISHED_WITH_RETURN` |
| Register `verification-rejected-2` publisher | `0x2524ffc3629484d4cfca9dda5d39c5e4846f87cf4e8c312c63a88f53cf5aba02` | `ACCEPTED / FINISHED_WITH_RETURN` |
| Create job `3` with `0.01 GEN` escrow | `0x217e6bd7f3580b3fde6d9960a9f1910e6602516a070a538f62da1e7d522c9eab` | `ACCEPTED / FINISHED_WITH_RETURN` |
| Provider submits delivery + verification | `0x32f4351641a2842a43e4bbd15b6bc4005808503813e60d4e540fb9fe04e4fb74` | `ACCEPTED / FINISHED_WITH_RETURN` |
| Start review | `0x1ab491d9871de54956863ceca3eebe53603ed7d3858a97422059141742b16567` | `ACCEPTED / FINISHED_WITH_RETURN` |
| Resolve rejected evidence | `0x8a5d874ad33958b84018582f2b6abf0b4ce29233d7f3467aef17243756e6064d` | live read-back: `REVIEWED / REJECTED`, consensus-bound |
| Finalize job `3` | `0x741e7352c371f3a10cd8dc13acfe01551e816ecbdd8c95cf441fc816067db9c0` | `ACCEPTED / FINISHED_WITH_RETURN`; refund selected |
| Client withdraws refund | `0x21527fd17dda67417f2ca8a21c779f4411d26b1c4a8cee990a79bd5671fe5a11` | `ACCEPTED / FINISHED_WITH_RETURN`; `0.01 GEN` transfer |

Final read-back for `get_job(3)` returned `status: 8` (`SETTLED`),
`decision: 2` (`REJECTED`), `confidence: 9500`, `reason_code:
criteria_not_satisfied`, `consensus_bound: true`, `resolution_count: 1`, and
`withdrawn: true`. `is_final(3)` returned `true` and
`can_withdraw(3, client)` returned `false` after the one-time refund.
