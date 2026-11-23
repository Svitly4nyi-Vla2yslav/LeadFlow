import { connectLambda, getStore, setEnvironmentContext } from '@netlify/blobs';
import serverless from 'serverless-http';
import app from '../../apps/server/src/app';
import { db } from '../../apps/server/src/db/memory';
import { hydrateDatabase, isDatabaseMutation, snapshotDatabase, type StoredDatabase } from '../../apps/server/src/databaseSnapshot';

export type { StoredDatabase } from '../../apps/server/src/databaseSnapshot';
type FunctionEvent = { blobs?: string; headers?: Record<string, string>; httpMethod?: string; path?: string; rawUrl?: string };
type FunctionResponse = { statusCode: number; headers?: Record<string, string | number | boolean>; body?: string };

const DATABASE_KEY = 'database';
const expressHandler = serverless(app);

export { hydrateDatabase } from '../../apps/server/src/databaseSnapshot';

export { isDatabaseMutation } from '../../apps/server/src/databaseSnapshot';

/**
 * Підключає контекст Netlify Blobs для поточного виклику функції.
 * Якщо payload містить токен і заголовок сайту, додатково налаштовує явний
 * environment context; без event.blobs лише передає подію в connectLambda.
 *
 * @param event — нормалізована подія Netlify з необов'язковим blob-контекстом.
 * @sideEffects Налаштовує глобальний контекст SDK Netlify Blobs для цього виклику.
 */
const connectStrongBlobContext = (event: FunctionEvent) => {
  connectLambda(event as never);
  if (!event.blobs) return;
  const payload = JSON.parse(Buffer.from(event.blobs, 'base64').toString('utf8')) as { token?: string };
  const siteID = event.headers?.['x-nf-site-id'];
  if (payload.token && siteID) setEnvironmentContext({ apiURL: 'https://api.netlify.com', siteID, token: payload.token });
};

/**
 * Відновлює CRM зі strong-consistency blob, передає подію Express і після успішної
 * мутації зберігає новий знімок з optimistic concurrency через ETag.
 *
 * @param event — HTTP-подія Netlify, за якою також визначається факт мутації.
 * @param context — runtime-контекст, що без змін передається serverless-http.
 * @returns Відповідь Express або 409, якщо blob паралельно змінив інший виклик.
 * @sideEffects Читає Netlify Blobs, змінює in-memory db і за потреби записує її знімок.
 */
export const handler = async (event: FunctionEvent, context: unknown): Promise<FunctionResponse> => {
  connectStrongBlobContext(event);
  const store = getStore({ name: 'leadflow-crm', consistency: 'strong' });
  const entry = await store.getWithMetadata(DATABASE_KEY, { type: 'json' }) as { data: StoredDatabase; etag: string } | null;
  hydrateDatabase(entry?.data || null);

  const response = await expressHandler(event as never, context as never) as FunctionResponse;
  if (!isDatabaseMutation(event) || response.statusCode >= 500) return response;

  const snapshot: StoredDatabase = snapshotDatabase(db);
  const saved = entry
    ? await store.setJSON(DATABASE_KEY, snapshot, { onlyIfMatch: entry.etag })
    : await store.setJSON(DATABASE_KEY, snapshot, { onlyIfNew: true });
  if (!saved.modified) {
    return {
      statusCode: 409,
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ error: 'CRM data changed concurrently. Reload and retry.' })
    };
  }
  return response;
};
