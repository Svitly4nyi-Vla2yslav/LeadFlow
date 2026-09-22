import 'dotenv/config';

const configuredSessionHours = Number(process.env.SESSION_HOURS || 12);
const parseBoolean = (value: string | undefined) => value?.trim().toLowerCase() === 'true';
const nodeEnv = process.env.NODE_ENV || 'development';

export const ENV = {
  NODE_ENV: nodeEnv,
  PORT: Number(process.env.PORT || 3001),
  ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN || 'http://localhost:5173',
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || '',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || '',
  SESSION_SECRET: process.env.SESSION_SECRET || '',
  ALLOW_DEV_AUTH_BYPASS: parseBoolean(process.env.ALLOW_DEV_AUTH_BYPASS),
  VOICE_AGENT_INTEGRATION_TOKEN: process.env.VOICE_AGENT_INTEGRATION_TOKEN || '',
  VOICE_AGENT_APP_URL: process.env.VOICE_AGENT_APP_URL || (nodeEnv === 'production' ? '' : 'http://localhost:3002'),
  SESSION_HOURS: Number.isFinite(configuredSessionHours) ? Math.min(168, Math.max(1, configuredSessionHours)) : 12
} as const;
