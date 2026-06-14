import type { paths } from './generated/api-types';
type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
type UsagePreviewRequest = paths['/api/v1/usage/preview']['post']['requestBody']['content']['application/json'];
type UsagePreviewResponse = paths['/api/v1/usage/preview']['post']['responses']['200']['content']['application/json'];
type UsageReportRequest = paths['/api/v1/usage']['post']['requestBody']['content']['application/json'];
type UsageReportResponse = paths['/api/v1/usage']['post']['responses']['200']['content']['application/json'];
type PricingPlansResponse = paths['/api/pricing/plans']['get']['responses']['200']['content']['application/json'];
type SubscriptionPlansResponse = paths['/api/subscriptions/plans']['get']['responses']['200']['content']['application/json'];
type CurrentSubscriptionResponse = paths['/api/subscriptions/current']['get']['responses']['200']['content']['application/json'];
type CheckoutResponse = paths['/api/subscriptions/checkout']['post']['responses']['200']['content']['application/json'];
export type LedgerBillClientOptions = {
    baseUrl: string;
    tenantId?: string;
    apiKey?: string;
    accessToken?: string;
    fetchImpl?: FetchLike;
};
export declare class LedgerBillClient {
    private readonly baseUrl;
    private readonly tenantId?;
    private readonly apiKey?;
    private readonly accessToken?;
    private readonly fetchImpl;
    constructor(options: LedgerBillClientOptions);
    getPricingPlans(): Promise<PricingPlansResponse>;
    getSubscriptionPlans(): Promise<SubscriptionPlansResponse>;
    getCurrentSubscription(): Promise<CurrentSubscriptionResponse>;
    createCheckoutSession(planId: string): Promise<CheckoutResponse>;
    previewUsage(payload: UsagePreviewRequest): Promise<UsagePreviewResponse>;
    reportUsage(payload: UsageReportRequest): Promise<UsageReportResponse>;
    private request;
}
export {};
