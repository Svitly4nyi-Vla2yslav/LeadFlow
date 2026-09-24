import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { ENV } from './env';

const LEGACY_VERSION = '1';
const TASK_AWARE_VERSION = '2';
const TOKEN_LIFETIME_SECONDS = 5 * 60;
const CLOCK_SKEW_SECONDS = 30;
const SIGNING_CONTEXTS = {
  [LEGACY_VERSION]: 'leadflow.voice-agent-handoff.v1\0',
  [TASK_AWARE_VERSION]: 'leadflow.voice-agent-handoff.v2\0'
} as const;

export type LegacyVoiceAgentHandoff = {
  version: typeof LEGACY_VERSION;
  leadId: string;
  issuedAt: number;
  expiresAt: number;
  nonce: string;
};

export type TaskAwareVoiceAgentHandoff = {
  version: typeof TASK_AWARE_VERSION;
  leadId: string;
  callTaskId: string;
  issuedAt: number;
  expiresAt: number;
  nonce: string;
};

export type VoiceAgentHandoff = LegacyVoiceAgentHandoff | TaskAwareVoiceAgentHandoff;
export type HandoffVerification = { handoff: VoiceAgentHandoff; error: null } | { handoff: null; error: 'handoff_invalid' | 'handoff_expired' };

export type IssueOptions = {
  nowMs?: number;
  lifetimeSeconds?: number;
};

const signingSecret = () => ENV.SESSION_SECRET || ENV.ADMIN_PASSWORD;
export const voiceAgentHandoffSigningConfigured = () => signingSecret().length >= 12;

const signatureFor = (encodedPayload: string, version: keyof typeof SIGNING_CONTEXTS) => createHmac('sha256', signingSecret())
  .update(SIGNING_CONTEXTS[version])
  .update(encodedPayload)
  .digest('base64url');

const safelyEqual = (left: string, right: string) => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
};

const encodeAndSign = (payload: VoiceAgentHandoff) => {
  const encodedPayload = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  return `${encodedPayload}.${signatureFor(encodedPayload, payload.version)}`;
};

const timestamps = (options: IssueOptions) => {
  const issuedAt = Math.floor((options.nowMs ?? Date.now()) / 1000);
  return { issuedAt, expiresAt: issuedAt + (options.lifetimeSeconds ?? TOKEN_LIFETIME_SECONDS) };
};

/** Legacy Phase 5C lead-only handoff. Normal UI uses issueTaskAwareVoiceAgentHandoff. */
export const issueVoiceAgentHandoff = (leadId: string, options: IssueOptions = {}) => {
  if (!voiceAgentHandoffSigningConfigured()) throw new Error('Voice Agent handoff signing is not configured');
  const payload: LegacyVoiceAgentHandoff = {
    version: LEGACY_VERSION,
    leadId,
    ...timestamps(options),
    nonce: randomBytes(24).toString('base64url')
  };
  return encodeAndSign(payload);
};

export const issueTaskAwareVoiceAgentHandoff = (leadId: string, callTaskId: string, options: IssueOptions = {}) => {
  if (!voiceAgentHandoffSigningConfigured()) throw new Error('Voice Agent handoff signing is not configured');
  const payload: TaskAwareVoiceAgentHandoff = {
    version: TASK_AWARE_VERSION,
    leadId,
    callTaskId,
    ...timestamps(options),
    nonce: randomBytes(24).toString('base64url')
  };
  return encodeAndSign(payload);
};

export const verifyVoiceAgentHandoffResult = (token: string, nowMs = Date.now()): HandoffVerification => {
  const invalid: HandoffVerification = { handoff: null, error: 'handoff_invalid' };
  if (!voiceAgentHandoffSigningConfigured()) return invalid;
  const [encodedPayload, signature, ...extra] = token.split('.');
  if (!encodedPayload || !signature || extra.length) return invalid;

  try {
    const parsed = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8')) as Partial<VoiceAgentHandoff> & Record<string, unknown>;
    if (parsed.version !== LEGACY_VERSION && parsed.version !== TASK_AWARE_VERSION) return invalid;
    if (!safelyEqual(signature, signatureFor(encodedPayload, parsed.version))) return invalid;
    const keys = Object.keys(parsed).sort();
    const expectedKeys = parsed.version === TASK_AWARE_VERSION
      ? 'callTaskId,expiresAt,issuedAt,leadId,nonce,version'
      : 'expiresAt,issuedAt,leadId,nonce,version';
    if (keys.join(',') !== expectedKeys) return invalid;
    if (typeof parsed.leadId !== 'string' || !parsed.leadId) return invalid;
    if (parsed.version === TASK_AWARE_VERSION && (typeof parsed.callTaskId !== 'string' || !parsed.callTaskId)) return invalid;
    if (!Number.isSafeInteger(parsed.issuedAt) || !Number.isSafeInteger(parsed.expiresAt)) return invalid;
    if (typeof parsed.nonce !== 'string' || parsed.nonce.length < 32) return invalid;
    if ((parsed.expiresAt as number) <= (parsed.issuedAt as number)) return invalid;
    if ((parsed.expiresAt as number) - (parsed.issuedAt as number) > TOKEN_LIFETIME_SECONDS) return invalid;
    const now = Math.floor(nowMs / 1000);
    if ((parsed.expiresAt as number) <= now) return { handoff: null, error: 'handoff_expired' };
    if ((parsed.issuedAt as number) > now + CLOCK_SKEW_SECONDS) return invalid;
    return { handoff: parsed as VoiceAgentHandoff, error: null };
  } catch {
    return invalid;
  }
};

export const verifyVoiceAgentHandoff = (token: string, nowMs = Date.now()): VoiceAgentHandoff | null =>
  verifyVoiceAgentHandoffResult(token, nowMs).handoff;

export const getVoiceAgentAppUrl = () => {
  try {
    const url = new URL(ENV.VOICE_AGENT_APP_URL);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return null;
    return url.toString();
  } catch {
    return null;
  }
};
