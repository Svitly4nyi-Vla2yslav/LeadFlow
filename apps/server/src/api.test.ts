import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { Server } from 'node:http';

const temporaryDirectory = mkdtempSync(join(tmpdir(), 'leadflow-api-'));
process.env.LEADFLOW_DATA_FILE = join(temporaryDirectory, 'leadflow.json');

let server: Server;
let baseUrl = '';

before(async () => {
  const { default: app } = await import('./app');
  await new Promise<void>(resolve => {
    server = app.listen(0, '127.0.0.1', () => {
      const address = server.address();
      if (!address || typeof address === 'string') throw new Error('Test server has no TCP address');
      baseUrl = `http://127.0.0.1:${address.port}`;
      resolve();
    });
  });
});

after(async () => {
  await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  rmSync(temporaryDirectory, { recursive: true, force: true });
});

test('health endpoint reports persistent storage', async () => {
  const response = await fetch(`${baseUrl}/api/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true, storage: 'persistent-json' });
});

test('lead API creates, validates, updates and reports dashboard history', async () => {
  const createdResponse = await fetch(`${baseUrl}/api/clients`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ company: 'API Test GmbH', crmStatus: 'NEW' })
  });
  assert.equal(createdResponse.status, 201);
  const created = await createdResponse.json() as { id: string };

  const invalidResponse = await fetch(`${baseUrl}/api/clients/${created.id}`, {
    method: 'PATCH', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ crmStatus: 'AUDITED' })
  });
  assert.equal(invalidResponse.status, 400);

  const auditedResponse = await fetch(`${baseUrl}/api/clients/${created.id}`, {
    method: 'PATCH', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ crmStatus: 'AUDITED', auditProblem: 'CTA is hidden below the mobile fold.', proposedSolution: 'Place a sticky contact CTA.' })
  });
  assert.equal(auditedResponse.status, 200);

  const dashboard = await (await fetch(`${baseUrl}/api/dashboard`)).json() as { counts: Record<string, number> };
  assert.equal(dashboard.counts.AUDITED, 1);
});

test('canonical bulk import skips duplicates', async () => {
  const response = await fetch(`${baseUrl}/api/clients/import`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ leads: [{ Company: 'Import GmbH', Ort: 'Hildesheim', 'CRM Status': 'NEW' }, { Company: 'Import GmbH', Ort: 'Hildesheim', 'CRM Status': 'NEW' }] })
  });
  assert.equal(response.status, 200);
  const result = await response.json() as { created: number; skipped: number };
  assert.deepEqual(result, { created: 1, skipped: 1, errors: [] });
});
