import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';

config({ path: fileURLToPath(new URL('../../.env', import.meta.url)) });

const fail = (message: string): never => {
  console.error(message);
  process.exit(1);
};

const parseBaseUrl = (value: string) => {
  try {
    const parsed = new URL(value);
    if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Unsupported protocol');
    return parsed.toString().replace(/\/$/, '');
  } catch {
    return fail('--base-url must be a valid HTTP(S) URL.');
  }
};

const main = async () => {
  const argumentsList = process.argv.slice(2);
  const confirmed = argumentsList.includes('--confirm-write');
  const readArgument = (name: string) => argumentsList.find(argument => argument.startsWith(`${name}=`))?.slice(name.length + 1).trim();
  const leadId = readArgument('--lead-id');
  if (!confirmed) fail('No CRM write performed. Re-run with --confirm-write.');
  if (!leadId) fail('A canonical LeadFlow Client.id is required via --lead-id=<LEAD_ID>.');

  const token = process.env.VOICE_AGENT_INTEGRATION_TOKEN;
  if (!token) fail('VOICE_AGENT_INTEGRATION_TOKEN is not configured');

  const baseUrl = parseBaseUrl(readArgument('--base-url') || 'http://localhost:3001');
  const endpoint = `${baseUrl}/api/integrations/voice-agent/interactions`;
  const eventId = randomUUID();
  const summary = [
    'Testgespräch durchgeführt.',
    'Kunde interessiert sich für eine neue Webseite.',
    'Nächster Schritt ist eine Beratung.',
    'Außerdem möchte der Kunde über KI-Automatisierung sprechen.'
  ].join('\n');
  const payload = {
    contractVersion: '1.0',
    eventId,
    source: 'vs-ai-voice-agent',
    leadRef: { leadId },
    occurredAt: new Date().toISOString(),
    interaction: {
      channel: 'phone/cold call',
      direction: 'out',
      summary,
      outcome: 'CALL_COMPLETED'
    },
    nextAction: {
      type: 'MEETING',
      confirmed: true,
      note: 'Beratung als nächster Schritt bestätigt'
    }
  };
  const send = (body: unknown) => fetch(endpoint, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify(body)
  });

  const first = await send(payload);
  if (first.status === 401 || first.status === 503) fail(`Authentication/configuration failed with HTTP ${first.status}.`);
  if (first.status !== 201) fail(`Initial integration request failed with HTTP ${first.status}.`);
  const firstResult = await first.json() as { ok?: boolean; duplicate?: boolean };
  if (firstResult.ok !== true || firstResult.duplicate !== false) fail('Initial integration response did not confirm a new write.');

  console.log('Auth: OK');
  console.log('UTF-8 request: accepted');
  console.log('CRM write: accepted');

  const duplicate = await send(payload);
  if (duplicate.status !== 200) fail(`Duplicate retry failed with HTTP ${duplicate.status}.`);
  const duplicateResult = await duplicate.json() as { ok?: boolean; duplicate?: boolean };
  if (duplicateResult.ok !== true || duplicateResult.duplicate !== true) fail('Duplicate retry was not recognized.');
  console.log('Duplicate protection: OK');

  const conflictPayload = {
    ...payload,
    interaction: { ...payload.interaction, summary: `${summary}\nKonfliktprüfung.` }
  };
  const conflict = await send(conflictPayload);
  const conflictResult = await conflict.json() as { error?: string };
  if (conflict.status !== 409 || conflictResult.error !== 'event_conflict') {
    fail(`Conflict protection failed with HTTP ${conflict.status}.`);
  }
  console.log('Conflict protection: OK');
};

main().catch(error => {
  const message = error instanceof Error ? error.message : 'Unknown request failure';
  fail(`Voice integration test failed: ${message}`);
});
