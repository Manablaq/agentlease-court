# Example evidence fixtures

The contract accepts publisher-hosted JSON records, not arbitrary text pasted
into a transaction. A real demo should host immutable records under the exact
registered publisher paths and pin their complete response-body SHA-256 hashes.

A fixture should contain the required fields documented in
[`../docs/EVIDENCE_RECORD_SPEC.md`](../docs/EVIDENCE_RECORD_SPEC.md), plus
domain-specific facts. For example:

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
  "signed_payload_hash": "computed-over-the-canonical-payload",
  "delivery_status": "complete",
  "acceptance_facts": ["all required files present"]
}
```

The placeholder signature is for format illustration only. It must not be used
as production evidence. The deployment demo will use real immutable fixtures
and record their computed hashes in its runbook.
