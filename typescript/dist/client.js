export class LedgerBillClient {
    baseUrl;
    tenantId;
    apiKey;
    accessToken;
    fetchImpl;
    constructor(options) {
        this.baseUrl = options.baseUrl.replace(/\/$/, '');
        this.tenantId = options.tenantId;
        this.apiKey = options.apiKey;
        this.accessToken = options.accessToken;
        this.fetchImpl = options.fetchImpl ?? fetch;
    }
    async getPricingPlans() {
        return this.request('GET', '/api/pricing/plans');
    }
    async getSubscriptionPlans() {
        return this.request('GET', '/api/subscriptions/plans');
    }
    async getCurrentSubscription() {
        return this.request('GET', '/api/subscriptions/current');
    }
    async createCheckoutSession(planId) {
        return this.request('POST', '/api/subscriptions/checkout', {
            body: { planId },
            idempotencyKey: `sdk-checkout-${Date.now()}`,
        });
    }
    async previewUsage(payload) {
        return this.request('POST', '/api/v1/usage/preview', { body: payload });
    }
    async reportUsage(payload) {
        return this.request('POST', '/api/v1/usage', {
            body: payload,
            idempotencyKey: `sdk-usage-${Date.now()}`,
        });
    }
    async request(method, route, options) {
        const headers = {
            Accept: 'application/json',
        };
        if (this.tenantId)
            headers['x-tenant-id'] = this.tenantId;
        if (this.apiKey)
            headers['x-api-key'] = this.apiKey;
        if (this.accessToken)
            headers.Authorization = `Bearer ${this.accessToken}`;
        if (options?.idempotencyKey)
            headers['Idempotency-Key'] = options.idempotencyKey;
        const hasBody = options?.body != null;
        if (hasBody)
            headers['Content-Type'] = 'application/json';
        const response = await this.fetchImpl(`${this.baseUrl}${route}`, {
            method,
            headers,
            body: hasBody ? JSON.stringify(options?.body) : undefined,
        });
        if (!response.ok) {
            let detail;
            try {
                detail = await response.json();
            }
            catch {
                detail = await response.text().catch(() => '');
            }
            throw new Error(`LedgerBill API ${method} ${route} failed: ${response.status} ${response.statusText} ${JSON.stringify(detail)}`);
        }
        return (await response.json());
    }
}
