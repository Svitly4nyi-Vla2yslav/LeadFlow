import 'dotenv/config';
export const ENV = {
  PORT: Number(process.env.PORT || 3001),
  ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN || 'http://localhost:5173',
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || ''
} as const;
