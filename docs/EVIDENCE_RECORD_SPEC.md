# AgentLease Court evidence record specification

The contract does not trust a URL merely because it is reachable. Before a
provider can submit a delivery, the publisher must be registered by the
contract owner. During review, every validator checks the URL authority, the
complete response-body hash, the record metadata, and the canonical payload
hash again.

## Required fields

| Field | Rule |
|---|---|
| `record_id` | Must equal the id pinned in the job. |
| `publisher_id` | Must equal the registered publisher pinned in the job. |
| `publisher_key_id` | Must equal the registered key identifier. |
| `source_group` | Must equal the registered group; delivery and verification groups must differ. |
| `version` | Positive integer equal to the pinned version. |
| `published_at` | Positive integer equal to the pinned timestamp. |
| `valid_until` | Greater than `published_at` and equal to the pinned expiry. |
| `signature` | Non-empty publisher signature artifact. |
| `signed_payload_hash` | SHA-256 of canonical JSON after removing `signature` and `signed_payload_hash`. |

The detached signature artifact is carried for publisher-layer verification and
auditability. The contract also enforces the registered HTTPS origin/path. A
caller cannot use a different host or ambiguous URL to impersonate a publisher.

## Recommended record content

Delivery records should expose normalized facts such as artifact identifiers,
completion status, output hashes, timestamps, and required-file checks.
Independent verification records should come from a different source group and
expose reproducible facts such as CI status, endpoint response shape, signed
artifact presence, or a provider-independent observation.

Do not use mutable dashboards, personalized pages, counters, or URLs with query
parameters. Prefer immutable raw records or commit-pinned files.
