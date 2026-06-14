<!-- ╔══════════════════════════════════════════════════════════════════════════════╗
     ║  🔐 Noir Stack LLC - Business Source License 1.1 (BSL)           ║
     ║  Watermark: e47a3f9c2d1b8e6a5f4c3b2a1d0e9f8a (Hira Barton)      ║
     ║  © 2026 Noir Stack LLC. All rights reserved.                      ║
     ╚══════════════════════════════════════════════════════════════════════════════╝ -->

```
   ███╗   ██╗ ██████╗ ██╗██████╗     ███████╗████████╗ █████╗  ██████╗██╗  ██╗
   ████╗  ██║██╔═══██╗██║██╔══██╗    ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
   ██╔██╗ ██║██║   ██║██║██║  ██║    █████╗     ██║   ███████║██║     █████╔╝
   ██║╚██╗██║██║   ██║██║██║  ██║    ██╔══╝     ██║   ██╔══██║██║     ██╔═██╗
   ██║ ╚████║╚██████╔╝██║██████╔╝    ███████╗   ██║   ██║  ██║╚██████╗██║  ██╗
   ╚═╝  ╚═══╝ ╚═════╝ ╚═╝╚═════╝     ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
    LedgerBill VS Code Extension | BSL 1.1 | © Noir Stack LLC
```

# LedgerBill for Visual Studio Code

**A Noir Stack LLC Product**

Build and validate LedgerBill usage-metering integrations from VS Code.

This extension is designed for customer organizations using LedgerBill's public API. It does not expose LedgerBill Platform Admin, internal diagnostics, route governance, key rotation, or LedgerBill team-only operations.

## Features

- Store an organization-scoped LedgerBill API key in VS Code Secret Storage.
- Check the public LedgerBill OpenAPI contract.
- Open the LedgerBill API reference.
- Preview usage rating without writing billable usage.
- Report a usage event with an idempotency key.
- Insert `.env` settings for server-side integrations.
- Add JavaScript and TypeScript snippets for `/api/v1/usage`.

## Commands

- `LedgerBill: Set API Key`
- `LedgerBill: Clear API Key`
- `LedgerBill: Check Connection`
- `LedgerBill: Open API Reference`
- `LedgerBill: Preview Usage Rating`
- `LedgerBill: Report Usage Event`
- `LedgerBill: Insert .env Template`

## Settings

| Setting | Default | Description |
| --- | --- | --- |
| `ledgerbill.baseUrl` | `https://ledgerbill.app` | LedgerBill API base URL. |
| `ledgerbill.tenantId` | empty | Optional tenant ID for generated snippets and session-scoped calls. |
| `ledgerbill.defaultFeatureKey` | `api_calls` | Default feature key for usage previews and reports. |

## Getting Started

1. Install the extension.
2. Run `LedgerBill: Set API Key`.
3. Paste an organization-scoped API key from LedgerBill.
4. Run `LedgerBill: Check Connection`.
5. Run `LedgerBill: Preview Usage Rating`.

## Publishing

This package is structured for formal Marketplace submission:

```bash
npm install
npm run lint
npm test
npm run package
```

To publish with the verified `LedgerBill` Marketplace publisher, run:

```bash
npm run publish
```

## Links

- Marketplace publisher: https://marketplace.visualstudio.com/items?itemName=LedgerBill.ledgerbill
- Website: https://ledgerbill.app
- Company: https://noirstack.com
- Issues: https://github.com/no1rstack/ledgerbill-sdk/issues
- Support: https://github.com/no1rstack/ledgerbill-sdk/issues
- LinkedIn: https://www.linkedin.com/company/113360045/
- Source: https://github.com/NoirStackLLC

## Privacy and Security

API keys are stored with VS Code Secret Storage. The extension sends requests only to the configured LedgerBill base URL and only calls customer-facing endpoints:

- `/api/openapi.json`
- `/api/docs`
- `/api/v1/usage/preview`
- `/api/v1/usage`

When running `LedgerBill: Check Connection`, the extension validates `/api/openapi.json` for:

- Required governed tags:
	- `Tenant Administration`
	- `Billing Operations`
	- `Developer APIs`
	- `Stripe Integration`
	- `Policy Administration`
	- `Audit & Governance`
	- `Replay Operations`
- Forbidden public terms:
	- `event-sourced`
	- `platform admins` / `Platform Administrator`
	- `platform operations`

The OpenAPI source of truth is `src/openapi.ts`, published at `/api/openapi.json`.

## Requirements

- VS Code 1.92.0 or newer.
- A LedgerBill organization API key.

## License

This project is licensed under the **Business Source License 1.1 (BSL)**.

- **Change Date:** 2030-06-14 (4 years from initial release)
- **Change License:** Apache License 2.0
- **Commercial Use:** Restricted until Change Date
- **After Change Date:** Automatically converts to Apache 2.0

For more details, see [LICENSE](../../LICENSE).

© 2026 **Noir Stack LLC**. All rights reserved.

For alternative licensing arrangements, contact: legal@noirstack.com
