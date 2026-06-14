export type LedgerBillConfig = {
  baseUrl: string;
  tenantId?: string;
  apiKey?: string;
};

export type UsagePayload = {
  customerId: string;
  featureKey: string;
  amount: number;
  timestamp?: string;
};

export type LedgerBillFetch = typeof fetch;

const REQUIRED_PUBLIC_TAGS = [
  'Tenant Administration',
  'Billing Operations',
  'Developer APIs',
  'Stripe Integration',
  'Policy Administration',
  'Audit & Governance',
  'Replay Operations',
] as const;

const FORBIDDEN_PUBLIC_TERMS = [
  /event-sourced/i,
  /platform admins?/i,
  /Platform Administrator/i,
  /platform operations/i,
];

export class LedgerBillApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly body?: string,
  ) {
    super(message);
  }
}

export const normalizeBaseUrl = (value: string) => {
  const trimmed = String(value || '').trim();
  if (!trimmed) return 'https://ledgerbill.app';
  return trimmed.replace(/\/+$/, '');
};

export const buildUrl = (baseUrl: string, path: string) => {
  return `${normalizeBaseUrl(baseUrl)}${path.startsWith('/') ? path : `/${path}`}`;
};

export const buildHeaders = (config: LedgerBillConfig, extra?: Record<string, string>) => {
  const headers: Record<string, string> = {
    accept: 'application/json',
    ...(extra || {}),
  };

  if (config.apiKey) {
    headers['x-api-key'] = config.apiKey;
  }

  if (config.tenantId) {
    headers['x-tenant-id'] = config.tenantId;
  }

  return headers;
};

export const createIdempotencyKey = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `lb-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const parseResponse = async <T>(response: Response): Promise<T> => {
  const bodyText = await response.text();

  if (!response.ok) {
    throw new LedgerBillApiError(
      `LedgerBill API request failed with ${response.status}`,
      response.status,
      bodyText,
    );
  }

  if (!bodyText) return undefined as T;

  try {
    return JSON.parse(bodyText) as T;
  } catch {
    return bodyText as T;
  }
};

export class LedgerBillClient {
  constructor(
    private readonly config: LedgerBillConfig,
    private readonly fetchImpl: LedgerBillFetch = fetch,
  ) {}

  async health() {
    const response = await this.fetchImpl(buildUrl(this.config.baseUrl, '/api/openapi.json'), {
      headers: buildHeaders(this.config),
    });
    const spec = await parseResponse<{
      info?: { title?: string; version?: string; description?: string };
      tags?: Array<{ name?: string }>;
      paths?: Record<string, unknown>;
    }>(response);
    const tagNames = (spec.tags || [])
      .map((tag) => String(tag?.name || '').trim())
      .filter(Boolean);
    const missingRequiredTags = REQUIRED_PUBLIC_TAGS.filter((tag) => !tagNames.includes(tag));
    const serializedSpec = JSON.stringify(spec);
    const forbiddenTermsFound = FORBIDDEN_PUBLIC_TERMS.filter((pattern) => pattern.test(serializedSpec)).map((pattern) => pattern.source);

    return {
      title: spec.info?.title || 'LedgerBill API',
      version: spec.info?.version || 'unknown',
      description: spec.info?.description || '',
      tags: tagNames,
      missingRequiredTags,
      forbiddenTermsFound,
      pathCount: Object.keys(spec.paths || {}).length,
    };
  }

  async previewUsage(payload: UsagePayload) {
    return this.sendUsage('/api/v1/usage/preview', payload);
  }

  async reportUsage(payload: UsagePayload) {
    return this.sendUsage('/api/v1/usage', payload);
  }

  private async sendUsage(path: '/api/v1/usage/preview' | '/api/v1/usage', payload: UsagePayload) {
    if (!this.config.apiKey) {
      throw new LedgerBillApiError('LedgerBill API key is not configured.');
    }

    const response = await this.fetchImpl(buildUrl(this.config.baseUrl, path), {
      method: 'POST',
      headers: buildHeaders(this.config, {
        'content-type': 'application/json',
        'idempotency-key': createIdempotencyKey(),
      }),
      body: JSON.stringify({
        ...payload,
        timestamp: payload.timestamp || new Date().toISOString(),
      }),
    });

    return parseResponse<Record<string, unknown>>(response);
  }
}
