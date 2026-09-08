# Bradbury deployment log

Status: deployed and partially smoke-tested on Bradbury.

This file will contain only verified facts. It must not contain a guessed
contract address, guessed transaction hash, or a deployment claim based solely
on local compilation.

## Verified deployment

- Contract: `AgentLeaseCourt`
- Source file: `contracts/agentlease_court.py`
- Source SHA-256: `f6bd86e5c670486c4ee44f87a99da49c07c210c8ea02e25e344f88e96d03d346`
- Bradbury contract address: `0xebEf03d3074DE546Fd402f0A3AdD881fd5EEcaDb`
- Deployment transaction: `0x7e3b8d8fd5e0efc6b1c4ed8922ed82895a15f4de36cdfc6bd4fdbeac99955519`
- Deployment execution: `FINISHED_WITH_RETURN`
- Explorer: <https://explorer-bradbury.genlayer.com/address/0xebEf03d3074DE546Fd402f0A3AdD881fd5EEcaDb>

## Verified Bradbury transactions

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

This proves deployment, publisher registration, payable escrow entry,
authorization, deterministic cancellation, exact refund transfer, and
one-time settlement. The live non-deterministic evidence-review path,
challenge re-evaluation, approved provider payout, and rejected refund path
remain pending publication of immutable JSON fixtures and a separate smoke
run. Bradbury source retrieval is not exposed by the current SDK; source
parity is recorded from the exact deployment input and local manifest.
