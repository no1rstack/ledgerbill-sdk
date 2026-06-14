<!-- ╔════════════════════════════════════════════════════════════════════╗
     ║  🔐 Noir Stack LLC - Business Source License 1.1 (BSL)           ║
     ║  Watermark: e47a3f9c2d1b8e6a5f4c3b2a1d0e9f8a (Hira Barton)      ║
     ║  © 2026 Noir Stack LLC. All rights reserved.                      ║
     ╚════════════════════════════════════════════════════════════════════╝ -->

```
   ███╗   ██╗ ██████╗ ██╗██████╗     ███████╗████████╗ █████╗  ██████╗██╗  ██╗
   ████╗  ██║██╔═══██╗██║██╔══██╗    ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
   ██╔██╗ ██║██║   ██║██║██████╔╝    ███████╗   ██║   ███████║██║     █████╔╝
   ██║╚██╗██║██║   ██║██║██╔══██╗    ╚════██║   ██║   ██╔══██║██║     ██╔═██╗
   ██║ ╚████║╚██████╔╝██║██║  ██║    ███████║   ██║   ██║  ██║╚██████╗██║  ██╗
   ╚═╝  ╚═══╝ ╚═════╝ ╚═╝╚═╝  ╚═╝    ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
    LedgerBill SDK | Python | BSL 1.1 | © Noir Stack LLC
```

# ledgerbill-sdk

Official Python SDK scaffold for LedgerBill.

The SDK aligns to the canonical OpenAPI source (`src/openapi.ts`) served at `/api/openapi.json`.

## Package listings

- npm: https://www.npmjs.com/package/@noirstack/ledgerbill-sdk
- PyPI: https://pypi.org/project/ledgerbill-sdk/
- VS Code Marketplace: https://marketplace.visualstudio.com/items?itemName=LedgerBill.ledgerbill
- Website: https://ledgerbill.app

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

## Support & Discussion

- Issues: https://github.com/no1rstack/ledgerbill-sdk/issues
- Discussions: https://github.com/no1rstack/ledgerbill-sdk/discussions
- Wiki: https://github.com/no1rstack/ledgerbill-sdk/wiki

## License

This project is licensed under the **Business Source License 1.1 (BSL)**.

- **Change Date:** 2030-06-14 (4 years from initial release)
- **Change License:** Apache License 2.0
- **Commercial Use:** Restricted until Change Date
- **After Change Date:** Automatically converts to Apache 2.0

For more details, see [LICENSE](./LICENSE).

© 2026 **Noir Stack LLC**. All rights reserved.

For alternative licensing arrangements, contact: legal@noirstack.com
