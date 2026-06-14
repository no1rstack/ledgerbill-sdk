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
    LedgerBill SDK | TypeScript | BSL 1.1 | © Noir Stack LLC
```

# @noirstack/ledgerbill-sdk

Official TypeScript client scaffold for LedgerBill.

The SDK contract is generated from the canonical OpenAPI source (`src/openapi.ts`) and exported to `/api/openapi.json`.

## Package listings

- npm: https://www.npmjs.com/package/@noirstack/ledgerbill-sdk
- PyPI: https://pypi.org/project/ledgerbill-sdk/
- VS Code Marketplace: https://marketplace.visualstudio.com/items?itemName=LedgerBill.ledgerbill
- Website: https://ledgerbill.app

## Build flow

From repository root:

1. Export OpenAPI source of truth:
   - `npm run openapi:export`
2. Generate strongly-typed API contracts:
   - `npm run sdk:types`
3. Build SDK package:
   - `npm run sdk:build`
4. Create local tarball for publishing checks:
   - `npm run sdk:pack`

## Basic usage

```ts
import { LedgerBillClient } from '@ledgerbill/sdk';

const client = new LedgerBillClient({
  baseUrl: 'http://localhost:3107',
  tenantId: 'tenant_123',
  apiKey: 'lb_your_api_key',
});

const plans = await client.getPricingPlans();
const preview = await client.previewUsage({
  customerId: 'cus_123',
  featureKey: 'events_processed',
  amount: 1000,
});
```

## Notes

- This package is currently scaffolded from OpenAPI and intentionally thin.
- Any route types come from `src/generated/api-types.ts`.
- Re-run `npm run sdk:types` after API contract changes.
- Public OpenAPI governance taxonomy expected in `/api/openapi.json`:
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
