import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { ENV } from './env';

const VERSION = '1';
const TOKEN_LIFETIME_SECONDS = 5 * 60;
const CLOCK_SKEW_SECONDS = 30;
const SIGNING_CONTEXT = 'leadflow.voice-agent-handoff.v1\0';

export type VoiceAgentHandoff = {
  version: typeof VERSION;
  leadId: string;
  issuedAt: number;
  expiresAt: number;
  nonce: string;
};

type IssueOptions = {
  nowMs?: number;
  lifetimeSeconds?: number;
};

const signingSecret = () => ENV.SESSION_SECRET || ENV.ADMIN_PASSWORD;
export const voiceAgentHandoffSigningConfigured = () => signingSecret().length >= 12;

const signatureFor = (encodedPayload: string) => createHmac('sha256', signingSecret())
  .update(SIGNING_CONTEXT)
  .update(encodedPayload)
  .digest('base64url');

const safelyEqual = (left: string, right: string) => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
};

export const issueVoiceAgentHandoff = (leadId: string, options: IssueOptions = {}) => {
  if (!voiceAgentHandoffSigningConfigured()) throw new Error('Voice Agent handoff signing is not configured');
  const issuedAt = Math.floor((options.nowMs ?? Date.now()) / 1000);
  const lifetimeSeconds = options.lifetimeSeconds ?? TOKEN_LIFETIME_SECONDS;
  const payload: VoiceAgentHandoff = {
    version: VERSION,
    leadId,
    issuedAt,
    expiresAt: issuedAt + lifetimeSeconds,
    nonce: randomBytes(24).toString('base64url')
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  return `${encodedPayload}.${signatureFor(encodedPayload)}`;
};

export const verifyVoiceAgentHandoff = (token: string, nowMs = Date.now()): VoiceAgentHandoff | null => {
  if (!voiceAgentHandoffSigningConfigured()) return null;
  const [encodedPayload, signature, ...extra] = token.split('.');
  if (!encodedPayload || !signature || extra.length || !safelyEqual(signature, signatureFor(encodedPayload))) return null;

  try {
    const parsed = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8')) as Partial<VoiceAgentHandoff> & Record<string, unknown>;
    const keys = Object.keys(parsed).sort();
    if (keys.join(',') !== 'expiresAt,issuedAt,leadId,nonce,version') return null;
    if (parsed.version !== VERSION || typeof parsed.leadId !== 'string' || !parsed.leadId) return null;
    if (!Number.isSafeInteger(parsed.issuedAt) || !Number.isSafeInteger(parsed.expiresAt)) return null;
    if (typeof parsed.nonce !== 'string' || parsed.nonce.length < 32) return null;
    if ((parsed.expiresAt as number) <= (parsed.issuedAt as number)) return null;
    if ((parsed.expiresAt as number) - (parsed.issuedAt as number) > TOKEN_LIFETIME_SECONDS) return null;
    const now = Math.floor(nowMs / 1000);
    if ((parsed.expiresAt as number) <= now || (parsed.issuedAt as number) > now + CLOCK_SKEW_SECONDS) return null;
    return parsed as VoiceAgentHandoff;
  } catch {
    return null;
  }
};

export const getVoiceAgentAppUrl = () => {
  try {
    const url = new URL(ENV.VOICE_AGENT_APP_URL);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return null;
    return url.toString();
  } catch {
    return null;
  }
};
