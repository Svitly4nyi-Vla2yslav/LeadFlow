import 'dotenv/config';

const configuredSessionHours = Number(process.env.SESSION_HOURS || 12);
const parseBoolean = (value: string | undefined) => value?.trim().toLowerCase() === 'true';

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT || 3001),
  ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN || 'http://localhost:5173',
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || '',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || '',
  SESSION_SECRET: process.env.SESSION_SECRET || '',
  ALLOW_DEV_AUTH_BYPASS: parseBoolean(process.env.ALLOW_DEV_AUTH_BYPASS),
  VOICE_AGENT_INTEGRATION_TOKEN: process.env.VOICE_AGENT_INTEGRATION_TOKEN || '',
  SESSION_HOURS: Number.isFinite(configuredSessionHours) ? Math.min(168, Math.max(1, configuredSessionHours)) : 12
} as const;
