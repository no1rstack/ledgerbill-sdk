import * as vscode from 'vscode';
import { LedgerBillApiError, LedgerBillClient, UsagePayload, buildUrl, normalizeBaseUrl } from './apiClient';

const SECRET_KEY = 'ledgerbill.apiKey';

class StatusItem extends vscode.TreeItem {
  constructor(label: string, description?: string, command?: vscode.Command) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.description = description;
    this.command = command;
  }
}

class LedgerBillStatusProvider implements vscode.TreeDataProvider<StatusItem> {
  private readonly changeEmitter = new vscode.EventEmitter<void>();
  readonly onDidChangeTreeData = this.changeEmitter.event;
  private lastStatus = 'Not checked';

  constructor(private readonly context: vscode.ExtensionContext) {}

  refresh(status?: string) {
    if (status) this.lastStatus = status;
    this.changeEmitter.fire();
  }

  async getChildren(): Promise<StatusItem[]> {
    const config = getConfig();
    const apiKey = await this.context.secrets.get(SECRET_KEY);
    return [
      new StatusItem('API', normalizeBaseUrl(config.baseUrl), {
        command: 'ledgerbill.openApiReference',
        title: 'Open API Reference',
      }),
      new StatusItem('Tenant', config.tenantId || 'Not configured'),
      new StatusItem('API Key', apiKey ? 'Stored in Secret Storage' : 'Not configured', {
        command: 'ledgerbill.configureApiKey',
        title: 'Set API Key',
      }),
      new StatusItem('Status', this.lastStatus, {
        command: 'ledgerbill.checkConnection',
        title: 'Check Connection',
      }),
    ];
  }

  getTreeItem(element: StatusItem): vscode.TreeItem {
    return element;
  }
}

const getConfig = () => {
  const config = vscode.workspace.getConfiguration('ledgerbill');
  return {
    baseUrl: normalizeBaseUrl(config.get<string>('baseUrl') || 'https://ledgerbill.app'),
    tenantId: String(config.get<string>('tenantId') || '').trim(),
    defaultFeatureKey: String(config.get<string>('defaultFeatureKey') || 'api_calls').trim() || 'api_calls',
  };
};

const getClient = async (context: vscode.ExtensionContext) => {
  const config = getConfig();
  const apiKey = await context.secrets.get(SECRET_KEY);
  return new LedgerBillClient({
    baseUrl: config.baseUrl,
    tenantId: config.tenantId || undefined,
    apiKey: apiKey || undefined,
  });
};

const showApiError = (error: unknown) => {
  if (error instanceof LedgerBillApiError) {
    const detail = error.status ? ` (${error.status})` : '';
    void vscode.window.showErrorMessage(`${error.message}${detail}`);
    return;
  }

  const message = error instanceof Error ? error.message : String(error);
  void vscode.window.showErrorMessage(`LedgerBill command failed: ${message}`);
};

const promptUsagePayload = async (): Promise<UsagePayload | undefined> => {
  const config = getConfig();
  const customerId = await vscode.window.showInputBox({
    title: 'LedgerBill customer ID',
    prompt: 'Enter the customer identifier used by your application.',
    ignoreFocusOut: true,
    validateInput: (value) => value.trim() ? undefined : 'Customer ID is required.',
  });
  if (!customerId) return undefined;

  const featureKey = await vscode.window.showInputBox({
    title: 'LedgerBill feature key',
    prompt: 'Enter the metered feature key.',
    value: config.defaultFeatureKey,
    ignoreFocusOut: true,
    validateInput: (value) => value.trim() ? undefined : 'Feature key is required.',
  });
  if (!featureKey) return undefined;

  const amountRaw = await vscode.window.showInputBox({
    title: 'LedgerBill usage amount',
    prompt: 'Enter the usage quantity.',
    value: '1',
    ignoreFocusOut: true,
    validateInput: (value) => {
      const amount = Number(value);
      return Number.isFinite(amount) && amount >= 0 ? undefined : 'Amount must be a non-negative number.';
    },
  });
  if (!amountRaw) return undefined;

  return {
    customerId: customerId.trim(),
    featureKey: featureKey.trim(),
    amount: Number(amountRaw),
  };
};

export function activate(context: vscode.ExtensionContext) {
  const statusProvider = new LedgerBillStatusProvider(context);
  context.subscriptions.push(vscode.window.registerTreeDataProvider('ledgerbill.status', statusProvider));

  context.subscriptions.push(vscode.commands.registerCommand('ledgerbill.configureApiKey', async () => {
    const apiKey = await vscode.window.showInputBox({
      title: 'LedgerBill API key',
      prompt: 'Paste an organization-scoped LedgerBill API key.',
      password: true,
      ignoreFocusOut: true,
      validateInput: (value) => value.trim() ? undefined : 'API key is required.',
    });
    if (!apiKey) return;
    await context.secrets.store(SECRET_KEY, apiKey.trim());
    statusProvider.refresh('API key saved');
    void vscode.window.showInformationMessage('LedgerBill API key saved in VS Code Secret Storage.');
  }));

  context.subscriptions.push(vscode.commands.registerCommand('ledgerbill.clearApiKey', async () => {
    await context.secrets.delete(SECRET_KEY);
    statusProvider.refresh('API key cleared');
    void vscode.window.showInformationMessage('LedgerBill API key cleared.');
  }));

  context.subscriptions.push(vscode.commands.registerCommand('ledgerbill.checkConnection', async () => {
    try {
      const client = await getClient(context);
      const result = await client.health();
      const governanceOk = result.missingRequiredTags.length === 0 && result.forbiddenTermsFound.length === 0;
      const status = `${result.title} ${result.version} · ${result.pathCount} public paths · OpenAPI ${governanceOk ? 'governed' : 'drift detected'}`;
      statusProvider.refresh(status);
      if (governanceOk) {
        void vscode.window.showInformationMessage(`LedgerBill connected: ${status}`);
        return;
      }

      const details: string[] = [];
      if (result.missingRequiredTags.length > 0) {
        details.push(`Missing tags: ${result.missingRequiredTags.join(', ')}`);
      }
      if (result.forbiddenTermsFound.length > 0) {
        details.push(`Forbidden terms detected in spec: ${result.forbiddenTermsFound.join(', ')}`);
      }

      void vscode.window.showWarningMessage(`LedgerBill connected with OpenAPI drift: ${details.join(' | ')}`);
    } catch (error) {
      statusProvider.refresh('Connection failed');
      showApiError(error);
    }
  }));

  context.subscriptions.push(vscode.commands.registerCommand('ledgerbill.openApiReference', async () => {
    const config = getConfig();
    await vscode.env.openExternal(vscode.Uri.parse(buildUrl(config.baseUrl, '/api/docs')));
  }));

  context.subscriptions.push(vscode.commands.registerCommand('ledgerbill.previewUsage', async () => {
    const payload = await promptUsagePayload();
    if (!payload) return;

    try {
      const client = await getClient(context);
      const result = await client.previewUsage(payload);
      await vscode.window.showInformationMessage(`LedgerBill preview complete: ${JSON.stringify(result)}`);
    } catch (error) {
      showApiError(error);
    }
  }));

  context.subscriptions.push(vscode.commands.registerCommand('ledgerbill.reportUsage', async () => {
    const payload = await promptUsagePayload();
    if (!payload) return;

    const confirmation = await vscode.window.showWarningMessage(
      'Report this usage event to LedgerBill? This writes billable usage.',
      { modal: true },
      'Report Usage',
    );
    if (confirmation !== 'Report Usage') return;

    try {
      const client = await getClient(context);
      const result = await client.reportUsage(payload);
      await vscode.window.showInformationMessage(`LedgerBill usage reported: ${JSON.stringify(result)}`);
    } catch (error) {
      showApiError(error);
    }
  }));

  context.subscriptions.push(vscode.commands.registerCommand('ledgerbill.insertEnvTemplate', async () => {
    const editor = vscode.window.activeTextEditor;
    const config = getConfig();
    const snippet = new vscode.SnippetString([
      `LEDGERBILL_BASE_URL=${config.baseUrl}`,
      'LEDGERBILL_API_KEY=${1:lb_your_api_key}',
      `LEDGERBILL_TENANT_ID=${config.tenantId || '${2:tenant_id}'}`,
      'LEDGERBILL_USAGE_FEATURE=${3:api_calls}',
      '',
    ].join('\n'));

    if (editor) {
      await editor.insertSnippet(snippet);
    } else {
      const doc = await vscode.workspace.openTextDocument({ language: 'dotenv', content: '' });
      const newEditor = await vscode.window.showTextDocument(doc);
      await newEditor.insertSnippet(snippet);
    }
  }));
}

export function deactivate() {}
