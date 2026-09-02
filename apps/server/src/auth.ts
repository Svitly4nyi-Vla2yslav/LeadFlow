import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { Router, type NextFunction, type Request, type Response } from 'express';
import { ENV } from './env';

const COOKIE_NAME = 'leadflow_session';
const MAX_FAILED_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const sessions = new Map<string, number>();
const failedAttempts = new Map<string, number[]>();

const digest = (value: string) => createHash('sha256').update(value).digest();
const passwordMatches = (candidate: string) => timingSafeEqual(digest(candidate), digest(ENV.ADMIN_PASSWORD));
const now = () => Date.now();
const authConfigured = () => ENV.ADMIN_PASSWORD.length >= 12;

const readCookie = (req: Request, name: string) => {
  const source = req.headers.cookie || '';
  for (const item of source.split(';')) {
    const [key, ...value] = item.trim().split('=');
    if (key === name) return decodeURIComponent(value.join('='));
  }
  return undefined;
};

const clearExpiredSessions = () => {
  const current = now();
  for (const [token, expiresAt] of sessions) if (expiresAt <= current) sessions.delete(token);
};

const cookieOptions = (maxAgeSeconds: number) => [
  `${COOKIE_NAME}=`,
  'HttpOnly',
  'SameSite=Lax',
  'Path=/',
  `Max-Age=${maxAgeSeconds}`,
  ENV.NODE_ENV === 'production' ? 'Secure' : ''
].filter(Boolean).join('; ');

const issueSession = (res: Response) => {
  const token = randomBytes(32).toString('base64url');
  const expiresAt = now() + ENV.SESSION_HOURS * 60 * 60 * 1000;
  sessions.set(token, expiresAt);
  res.setHeader('Set-Cookie', cookieOptions(ENV.SESSION_HOURS * 60 * 60).replace(`${COOKIE_NAME}=`, `${COOKIE_NAME}=${token}`));
};

const revokeSession = (req: Request, res: Response) => {
  const token = readCookie(req, COOKIE_NAME);
  if (token) sessions.delete(token);
  res.setHeader('Set-Cookie', cookieOptions(0));
};

const isAuthenticated = (req: Request) => {
  clearExpiredSessions();
  const token = readCookie(req, COOKIE_NAME);
  return Boolean(token && sessions.has(token));
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
