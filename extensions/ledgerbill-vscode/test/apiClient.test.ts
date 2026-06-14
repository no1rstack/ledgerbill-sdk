import assert from 'node:assert/strict';
import { LedgerBillClient, buildHeaders, buildUrl, normalizeBaseUrl } from '../src/apiClient';

const jsonResponse = (body: unknown, init?: ResponseInit) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'content-type': 'application/json' },
    ...(init || {}),
  });

const test = async (name: string, fn: () => Promise<void> | void) => {
  try {
    await fn();
    console.log(`ok - ${name}`);
  } catch (error) {
    console.error(`not ok - ${name}`);
    throw error;
  }
};

void (async () => {
  await test('normalizes base URLs', () => {
    assert.equal(normalizeBaseUrl('https://ledgerbill.app///'), 'https://ledgerbill.app');
    assert.equal(buildUrl('https://ledgerbill.app/', '/api/v1/usage'), 'https://ledgerbill.app/api/v1/usage');
  });

  await test('builds public API headers without leaking missing values', () => {
    assert.deepEqual(buildHeaders({ baseUrl: 'https://ledgerbill.app' }), { accept: 'application/json' });
    assert.equal(buildHeaders({ baseUrl: 'x', apiKey: 'lb_key', tenantId: 'tenant_1' })['x-api-key'], 'lb_key');
    assert.equal(buildHeaders({ baseUrl: 'x', apiKey: 'lb_key', tenantId: 'tenant_1' })['x-tenant-id'], 'tenant_1');
  });

  await test('fetches public OpenAPI metadata for connection checks', async () => {
    const client = new LedgerBillClient({ baseUrl: 'https://ledgerbill.app' }, async (url) => {
      assert.equal(String(url), 'https://ledgerbill.app/api/openapi.json');
      return jsonResponse({
        info: { title: 'LedgerBill API', version: '1.0.0' },
        tags: [
          { name: 'Tenant Administration' },
          { name: 'Billing Operations' },
          { name: 'Developer APIs' },
          { name: 'Stripe Integration' },
          { name: 'Policy Administration' },
          { name: 'Audit & Governance' },
          { name: 'Replay Operations' },
        ],
        paths: { '/api/v1/usage': {} },
      });
    });

    const health = await client.health();
    assert.equal(health.title, 'LedgerBill API');
    assert.equal(health.version, '1.0.0');
    assert.equal(health.pathCount, 1);
    assert.equal(health.missingRequiredTags.length, 0);
    assert.equal(health.forbiddenTermsFound.length, 0);
  });

  await test('reports OpenAPI governance drift when tags are missing or forbidden terms appear', async () => {
    const client = new LedgerBillClient({ baseUrl: 'https://ledgerbill.app' }, async () => {
      return jsonResponse({
        info: {
          title: 'LedgerBill API',
          version: '1.0.0',
          description: 'event-sourced platform operations reference',
        },
        tags: [
          { name: 'Tenant Administration' },
          { name: 'Billing Operations' },
          { name: 'Developer APIs' },
        ],
        paths: { '/api/v1/usage': {} },
      });
    });

    const health = await client.health();
    assert.ok(health.missingRequiredTags.includes('Stripe Integration'));
    assert.ok(health.missingRequiredTags.includes('Replay Operations'));
    assert.ok(health.forbiddenTermsFound.some((term) => term.includes('event-sourced')));
    assert.ok(health.forbiddenTermsFound.some((term) => term.includes('platform operations')));
  });

  await test('sends usage previews only through public customer API', async () => {
    let seenUrl = '';
    const client = new LedgerBillClient({ baseUrl: 'https://ledgerbill.app', apiKey: 'lb_key' }, async (url, init) => {
      seenUrl = String(url);
      assert.equal(init?.method, 'POST');
      assert.equal((init?.headers as Record<string, string>)['x-api-key'], 'lb_key');
      assert.equal((init?.headers as Record<string, string>)['content-type'], 'application/json');
      assert.equal(typeof (init?.headers as Record<string, string>)['idempotency-key'], 'string');
      return jsonResponse({ status: 'preview' });
    });

    const result = await client.previewUsage({ customerId: 'cus_1', featureKey: 'api_calls', amount: 1 });
    assert.equal(seenUrl, 'https://ledgerbill.app/api/v1/usage/preview');
    assert.equal(result.status, 'preview');
  });
})();
