import 'dotenv/config';

// Попередньо перетворює тривалість сесії на число для подальшого обмеження діапазону.
const configuredSessionHours = Number(process.env.SESSION_HOURS || 12);
/**
 * Приймає необов’язкове текстове значення змінної середовища й повертає boolean.
 * Істинним вважає лише 'true' після обрізання пробілів і приведення регістру;
 * відсутні та всі інші значення без побічних ефектів перетворює на false.
 */
const parseBoolean = (value: string | undefined) => value?.trim().toLowerCase() === 'true';
const nodeEnv = process.env.NODE_ENV || 'development';

/**
 * Єдиний незмінний об’єкт нормалізованої серверної конфігурації, зчитаний під час імпорту модуля.
 * Порожні значення отримують локальні defaults; SESSION_HOURS обмежується 1–168 годинами,
 * а нечислове значення замінюється на 12. Секрети тут не виводяться й не змінюються.
 */
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
