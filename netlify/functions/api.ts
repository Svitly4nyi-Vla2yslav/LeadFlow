import { connectLambda, getStore } from '@netlify/blobs';
import serverless from 'serverless-http';
import app from '../../apps/server/src/app';
import { db, type Client, type Message } from '../../apps/server/src/db/memory';

type StoredDatabase = { clients: Client[]; messages: Message[] };
type FunctionEvent = { httpMethod?: string; path?: string; rawUrl?: string };
type FunctionResponse = { statusCode: number; headers?: Record<string, string | number | boolean>; body?: string };

const DATABASE_KEY = 'database';
const expressHandler = serverless(app);

const hydrateDatabase = (stored: StoredDatabase | null) => {
  db.clients.splice(0, db.clients.length, ...(Array.isArray(stored?.clients) ? stored.clients : []));
  db.messages.splice(0, db.messages.length, ...(Array.isArray(stored?.messages) ? stored.messages : []));
};

const isDatabaseMutation = (event: FunctionEvent) => {
  const method = (event.httpMethod || 'GET').toUpperCase();
  const path = event.path || (event.rawUrl ? new URL(event.rawUrl).pathname : '');
  return !['GET', 'HEAD', 'OPTIONS'].includes(method) && /\/api\/(clients|messages)(\/|$)/.test(path);
};

export const handler = async (event: FunctionEvent, context: unknown): Promise<FunctionResponse> => {
  connectLambda(event as never);
  const store = getStore('leadflow-crm');
  const stored = await store.get(DATABASE_KEY, { type: 'json' }) as StoredDatabase | null;
  hydrateDatabase(stored);

  const response = await expressHandler(event as never, context as never) as FunctionResponse;
  if (!isDatabaseMutation(event) || response.statusCode >= 500) return response;

  const snapshot: StoredDatabase = { clients: db.clients, messages: db.messages };
  await store.setJSON(DATABASE_KEY, snapshot);
  return response;
};
