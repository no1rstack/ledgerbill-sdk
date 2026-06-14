# ledgerbill-sdk

Public SDK-only repository for LedgerBill client packages.

## Contents

- `typescript/` — npm package source for `@noirstack/ledgerbill-sdk`
- `python/` — PyPI package source for `ledgerbill-sdk`

## Package links

- npm: https://www.npmjs.com/package/@noirstack/ledgerbill-sdk
- PyPI: https://pypi.org/project/ledgerbill-sdk/
- Homepage: https://ledgerbill.app

## Automation

This repository includes GitHub Actions workflow `.github/workflows/publish-sdks.yml` to publish both SDKs.

- Trigger by tag push: `sdk-v*` (for example: `sdk-v0.1.4`)
- Or run manually via workflow dispatch

### Required repository secrets

- `NPM_TOKEN` — npm automation token with publish permission for `@noirstack/ledgerbill-sdk`
- `PYPI_API_TOKEN` — PyPI token for `ledgerbill-sdk`
