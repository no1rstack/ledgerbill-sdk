# ledgerbill-sdk

Official Python SDK scaffold for LedgerBill.

The SDK aligns to the canonical OpenAPI source (`src/openapi.ts`) served at `/api/openapi.json`.

## Install (local)

```bash
pip install -e sdk/python
```

## Usage

```python
from ledgerbill_sdk import LedgerBillClient

client = LedgerBillClient(
    base_url="http://localhost:3107",
    tenant_id="tenant_123",
    api_key="lb_your_api_key"
)

plans = client.get_pricing_plans()
preview = client.preview_usage(
    customer_id="cus_123",
    feature_key="events_processed",
    amount=1000,
)
```

## Contract governance

The public API taxonomy expected in `/api/openapi.json` is:

- `Tenant Administration`
- `Billing Operations`
- `Developer APIs`
- `Stripe Integration`
- `Policy Administration`
- `Audit & Governance`
- `Replay Operations`
