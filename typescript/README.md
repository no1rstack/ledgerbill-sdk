# @ledgerbill/sdk

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

## Support

- Issues: https://github.com/no1rstack/ledgerbill-sdk/issues
