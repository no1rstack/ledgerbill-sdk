# Changelog

## 0.1.1

- Adds governed OpenAPI taxonomy validation in `LedgerBill: Check Connection`.
- Detects missing required public tags in `/api/openapi.json`:
	- `Tenant Administration`
	- `Billing Operations`
	- `Developer APIs`
	- `Stripe Integration`
	- `Policy Administration`
	- `Audit & Governance`
	- `Replay Operations`
- Detects forbidden public terminology drift in the served OpenAPI document.

## 0.1.0

- Initial Marketplace-ready LedgerBill extension.
- Adds tenant API key storage through VS Code Secret Storage.
- Adds connection checks, API reference opening, usage rating previews, and usage reporting.
- Adds JavaScript and TypeScript snippets for server-side usage metering.
