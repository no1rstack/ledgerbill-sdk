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
    LedgerBill SDKs & Extension | TypeScript, Python, VS Code | BSL 1.1 | © Noir Stack LLC
```

# LedgerBill SDKs & VS Code Extension

**A Noir Stack LLC Product**

Public repository for official LedgerBill client SDKs (TypeScript, Python) and VS Code extension.

## Contents

- `typescript/` — npm package source for `@noirstack/ledgerbill-sdk`
- `python/` — PyPI package source for `ledgerbill-sdk`

## Package links

- npm: https://www.npmjs.com/package/@noirstack/ledgerbill-sdk
- PyPI: https://pypi.org/project/ledgerbill-sdk/
- Homepage: https://ledgerbill.app
- Issues: https://github.com/no1rstack/ledgerbill-sdk/issues
- VS Code Marketplace: https://marketplace.visualstudio.com/items?itemName=LedgerBill.ledgerbill

## Automation

This repository includes GitHub Actions workflow `.github/workflows/publish-sdks.yml` to publish both SDKs.

- Trigger by tag push: `sdk-v*` (for example: `sdk-v0.1.4`)
- Or run manually via workflow dispatch

### Required repository secrets

- `NPM_TOKEN` — npm automation token with publish permission for `@noirstack/ledgerbill-sdk`
- `PYPI_API_TOKEN` — PyPI token for `ledgerbill-sdk`
- `DISCORD_PUBLISH_WEBHOOK_URL` — Discord webhook URL for release notifications

### Notes

- npm automation tokens expire; rotate `NPM_TOKEN` before expiry to avoid failed publish runs.
- You can keep `TWINE_USERNAME`, `TWINE_PASSWORD`, and `TWINE_REPOSITORY_URL` as optional compatibility secrets, but this workflow only requires `PYPI_API_TOKEN`.

## Contents

- `typescript/` — npm package source for `@noirstack/ledgerbill-sdk`
- `python/` — PyPI package source for `ledgerbill-sdk`
- `extensions/ledgerbill-vscode/` — VS Code Extension source

## License

This project is licensed under the **Business Source License 1.1 (BSL)**.

- **Change Date:** 2030-06-14 (4 years from initial release)
- **Change License:** Apache License 2.0
- **Commercial Use:** Restricted until Change Date
- **After Change Date:** Automatically converts to Apache 2.0

For more details, see [LICENSE](./LICENSE).

© 2026 **Noir Stack LLC**. All rights reserved.

For alternative licensing arrangements, contact: legal@noirstack.com
