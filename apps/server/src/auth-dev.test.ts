import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { Server } from 'node:http';

const temporaryDirectory = mkdtempSync(join(tmpdir(), 'leadflow-dev-auth-'));
process.env.LEADFLOW_DATA_FILE = join(temporaryDirectory, 'leadflow.json');
process.env.NODE_ENV = 'development';
process.env.ALLOW_DEV_AUTH_BYPASS = 'false';
process.env.ADMIN_PASSWORD = 'test-only-long-password';
process.env.SESSION_SECRET = 'test-only-session-secret-with-32-characters';

let server: Server;
let baseUrl = '';
let mutableEnv: {
  NODE_ENV: string;
  ALLOW_DEV_AUTH_BYPASS: boolean;
  ADMIN_PASSWORD: string;
};

before(async () => {
  const [{ default: app }, { ENV }] = await Promise.all([import('./app'), import('./env')]);
  mutableEnv = ENV as unknown as typeof mutableEnv;
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

const post = (path: string, body?: unknown, cookie?: string) => fetch(`${baseUrl}${path}`, {
  method: 'POST',
  headers: {
    ...(body === undefined ? {} : { 'content-type': 'application/json' }),
    ...(cookie ? { cookie } : {})
  },
  body: body === undefined ? undefined : JSON.stringify(body)
});

test('dev-unlock is rejected when the bypass flag is disabled', async () => {
  mutableEnv.NODE_ENV = 'development';
  mutableEnv.ALLOW_DEV_AUTH_BYPASS = false;
  assert.equal((await post('/api/auth/dev-unlock')).status, 404);
});

test('development bypass needs no admin password and its session accesses protected routes', async () => {
  mutableEnv.NODE_ENV = 'development';
  mutableEnv.ALLOW_DEV_AUTH_BYPASS = true;
  const originalPassword = mutableEnv.ADMIN_PASSWORD;
  mutableEnv.ADMIN_PASSWORD = '';
  try {
    const response = await post('/api/auth/dev-unlock');
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { authenticated: true, mode: 'development-bypass' });
    const cookie = (response.headers.get('set-cookie') || '').split(';')[0];
    assert.match(cookie, /^leadflow_session=/);

    const protectedResponse = await fetch(`${baseUrl}/api/clients`, { headers: { cookie } });
    assert.equal(protectedResponse.status, 200);
  } finally {
    mutableEnv.ADMIN_PASSWORD = originalPassword;
  }
});

test('production rejects dev-unlock even when the bypass flag is enabled', async () => {
  mutableEnv.NODE_ENV = 'production';
  mutableEnv.ALLOW_DEV_AUTH_BYPASS = true;
  try {
    assert.equal((await post('/api/auth/dev-unlock')).status, 404);
  } finally {
    mutableEnv.NODE_ENV = 'development';
  }
});

test('normal login and rate limiting remain intact while lockout does not block dev-unlock', async () => {
  mutableEnv.NODE_ENV = 'development';
  mutableEnv.ALLOW_DEV_AUTH_BYPASS = true;

  const login = await post('/api/auth/login', { password: 'test-only-long-password' });
  assert.equal(login.status, 200);
  assert.match(login.headers.get('set-cookie') || '', /leadflow_session=/);

  for (let attempt = 0; attempt < 5; attempt++) {
    assert.equal((await post('/api/auth/login', { password: 'wrong-password' })).status, 401);
  }
  assert.equal((await post('/api/auth/login', { password: 'test-only-long-password' })).status, 429);

  const bypass = await post('/api/auth/dev-unlock');
  assert.equal(bypass.status, 200);
  assert.deepEqual(await bypass.json(), { authenticated: true, mode: 'development-bypass' });
});
