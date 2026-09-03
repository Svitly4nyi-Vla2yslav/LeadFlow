import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { Router, type NextFunction, type Request, type Response } from 'express';
import { ENV } from './env';

const COOKIE_NAME = 'leadflow_session';
const MAX_FAILED_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const failedAttempts = new Map<string, number[]>();

const digest = (value: string) => createHash('sha256').update(value).digest();
const passwordMatches = (candidate: string) => timingSafeEqual(digest(candidate), digest(ENV.ADMIN_PASSWORD));
const now = () => Date.now();
const authConfigured = () => ENV.ADMIN_PASSWORD.length >= 12;
const secureCookies = () => ENV.NODE_ENV === 'production' || Boolean(process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME);
const sessionSecret = () => ENV.SESSION_SECRET || ENV.ADMIN_PASSWORD;
const sign = (payload: string) => createHmac('sha256', sessionSecret()).update(payload).digest('base64url');
const safelyEqual = (left: string, right: string) => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
};

const readCookie = (req: Request, name: string) => {
  const source = req.headers.cookie || '';
  for (const item of source.split(';')) {
    const [key, ...value] = item.trim().split('=');
    if (key === name) return decodeURIComponent(value.join('='));
  }
  return undefined;
};

const cookieOptions = (maxAgeSeconds: number) => [
  `${COOKIE_NAME}=`,
  'HttpOnly',
  'SameSite=Lax',
  'Path=/',
  `Max-Age=${maxAgeSeconds}`,
  secureCookies() ? 'Secure' : ''
].filter(Boolean).join('; ');

const issueSession = (res: Response) => {
  const expiresAt = now() + ENV.SESSION_HOURS * 60 * 60 * 1000;
  const payload = `v1.${expiresAt}.${randomBytes(24).toString('base64url')}`;
  const token = `${payload}.${sign(payload)}`;
  res.setHeader('Set-Cookie', cookieOptions(ENV.SESSION_HOURS * 60 * 60).replace(`${COOKIE_NAME}=`, `${COOKIE_NAME}=${token}`));
};

const revokeSession = (_req: Request, res: Response) => {
  res.setHeader('Set-Cookie', cookieOptions(0));
};

const isAuthenticated = (req: Request) => {
  const token = readCookie(req, COOKIE_NAME);
  if (!token) return false;
  const [version, expiresAtValue, nonce, signature, ...extra] = token.split('.');
  if (version !== 'v1' || !expiresAtValue || !nonce || !signature || extra.length) return false;
  const expiresAt = Number(expiresAtValue);
  if (!Number.isFinite(expiresAt) || expiresAt <= now()) return false;
  const payload = `${version}.${expiresAtValue}.${nonce}`;
  return safelyEqual(signature, sign(payload));
};

const requestKey = (req: Request) => req.ip || req.socket.remoteAddress || 'unknown';
const recentFailures = (req: Request) => {
  const key = requestKey(req);
  const cutoff = now() - ATTEMPT_WINDOW_MS;
  const recent = (failedAttempts.get(key) || []).filter(timestamp => timestamp > cutoff);
  failedAttempts.set(key, recent);
  return { key, recent };
};

export const authRouter = Router();

authRouter.get('/session', (req, res) => {
  res.json({ authenticated: isAuthenticated(req), configured: authConfigured() });
});

authRouter.post('/login', (req, res) => {
  if (!authConfigured()) return res.status(503).json({ error: 'Access is not configured' });
  const { key, recent } = recentFailures(req);
  if (recent.length >= MAX_FAILED_ATTEMPTS) return res.status(429).json({ error: 'Too many attempts. Try again later.' });
  const password = typeof req.body?.password === 'string' ? req.body.password.slice(0, 256) : '';
  if (!password || !passwordMatches(password)) {
    failedAttempts.set(key, [...recent, now()]);
    return res.status(401).json({ error: 'Access denied' });
  }
  failedAttempts.delete(key);
  issueSession(res);
  res.json({ authenticated: true });
});

authRouter.post('/logout', (req, res) => {
  revokeSession(req, res);
  res.json({ authenticated: false });
});

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!authConfigured()) return res.status(503).json({ error: 'Authentication is not configured' });
  if (!isAuthenticated(req)) return res.status(401).json({ error: 'Authentication required' });
  next();
};
