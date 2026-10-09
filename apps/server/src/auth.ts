import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { Router, type NextFunction, type Request, type Response } from 'express';
import { ENV } from './env';

const COOKIE_NAME = 'leadflow_session';
const MAX_FAILED_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const failedAttempts = new Map<string, number[]>();

// Перетворює секрет на буфер сталої довжини, придатний для timingSafeEqual.
const digest = (value: string) => createHash('sha256').update(value).digest();
// Порівнює пароль із конфігурацією без раннього виходу за позицією відмінного байта.
const passwordMatches = (candidate: string) => timingSafeEqual(digest(candidate), digest(ENV.ADMIN_PASSWORD));
// Так само перевіряє Bearer-токен окремої інтеграції голосового агента.
const integrationTokenMatches = (candidate: string) => timingSafeEqual(digest(candidate), digest(ENV.VOICE_AGENT_INTEGRATION_TOKEN));
// Централізоване джерело часу спрощує однакові розрахунки TTL і вікна невдалих спроб.
const now = () => Date.now();
// Адміністративний вхід вважається налаштованим лише за мінімальної довжини пароля.
const authConfigured = () => ENV.ADMIN_PASSWORD.length >= 12;
// Дозволяє dev-bypass лише локально: production, Netlify та AWS Lambda завжди його вимикають.
const devAuthBypassEnabled = () => ENV.NODE_ENV !== 'production'
  && !process.env.NETLIFY
  && !process.env.AWS_LAMBDA_FUNCTION_NAME
  && ENV.ALLOW_DEV_AUTH_BYPASS;
// Інтеграція активна лише з токеном щонайменше 32 символи.
const voiceIntegrationConfigured = () => ENV.VOICE_AGENT_INTEGRATION_TOKEN.length >= 32;
// Визначає, чи треба додати Secure для production і серверless-середовищ.
const secureCookies = () => ENV.NODE_ENV === 'production' || Boolean(process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME);
// Для HMAC бере окремий SESSION_SECRET, а за його відсутності — адміністративний пароль.
const sessionSecret = () => ENV.SESSION_SECRET || ENV.ADMIN_PASSWORD;
// Підписує незашифрований payload сесії HMAC-SHA256 і повертає URL-безпечний підпис.
const sign = (payload: string) => createHmac('sha256', sessionSecret()).update(payload).digest('base64url');
// Перед timingSafeEqual перевіряє однакову довжину буферів, інакше Node.js кинув би помилку.
const safelyEqual = (left: string, right: string) => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
};

// Шукає cookie за назвою в сирому заголовку та повертає декодоване значення або undefined.
const readCookie = (req: Request, name: string) => {
  const source = req.headers.cookie || '';
  for (const item of source.split(';')) {
    const [key, ...value] = item.trim().split('=');
    if (key === name) return decodeURIComponent(value.join('='));
  }
  return undefined;
};

// Формує атрибути session-cookie; порожній Secure відфільтровується в локальному режимі.
const cookieOptions = (maxAgeSeconds: number) => [
  `${COOKIE_NAME}=`,
  'HttpOnly',
  'SameSite=Lax',
  'Path=/',
  `Max-Age=${maxAgeSeconds}`,
  secureCookies() ? 'Secure' : ''
].filter(Boolean).join('; ');

/**
 * Видає підписану сесію v1 із терміном дії та випадковим nonce.
 * Побічний ефект — встановлення HttpOnly cookie у відповіді.
 */
const issueSession = (res: Response) => {
  const expiresAt = now() + ENV.SESSION_HOURS * 60 * 60 * 1000;
  const payload = `v1.${expiresAt}.${randomBytes(24).toString('base64url')}`;
  const token = `${payload}.${sign(payload)}`;
  res.setHeader('Set-Cookie', cookieOptions(ENV.SESSION_HOURS * 60 * 60).replace(`${COOKIE_NAME}=`, `${COOKIE_NAME}=${token}`));
};

// Відкликає браузерну сесію, перевстановлюючи ту саму cookie з Max-Age=0.
const revokeSession = (_req: Request, res: Response) => {
  res.setHeader('Set-Cookie', cookieOptions(0));
};

/**
 * Перевіряє структуру, строк дії та HMAC-підпис cookie.
 * Повертає false для відсутньої, пошкодженої або простроченої сесії.
 */
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

// Використовує мережеву адресу як ключ ліміту невдалих входів.
const requestKey = (req: Request) => req.ip || req.socket.remoteAddress || 'unknown';
// Відкидає застарілі спроби для поточної адреси та повертає активне 15-хвилинне вікно.
const recentFailures = (req: Request) => {
  const key = requestKey(req);
  const cutoff = now() - ATTEMPT_WINDOW_MS;
  const recent = (failedAttempts.get(key) || []).filter(timestamp => timestamp > cutoff);
  failedAttempts.set(key, recent);
  return { key, recent };
};

export const authRouter = Router();

// Повідомляє клієнту стан поточної сесії та готовність конфігурації.
authRouter.get('/session', (req, res) => {
  res.json({ authenticated: isAuthenticated(req), configured: authConfigured() });
});

// Видає тестову сесію лише коли локальний bypass справді дозволено.
authRouter.post('/dev-unlock', (_req, res) => {
  if (!devAuthBypassEnabled()) return res.status(404).json({ error: 'Route not found' });
  issueSession(res);
  res.json({ authenticated: true, mode: 'development-bypass' });
});

// Перевіряє rate limit і пароль, а після успіху очищує історію помилок та видає cookie.
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

// Завершує сесію незалежно від її поточного стану.
authRouter.post('/logout', (req, res) => {
  revokeSession(req, res);
  res.json({ authenticated: false });
});

// Пропускає захищений маршрут лише з валідною сесією або повертає точний статус конфігурації/доступу.
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!authConfigured() && !devAuthBypassEnabled()) return res.status(503).json({ error: 'Authentication is not configured' });
  if (!isAuthenticated(req)) return res.status(401).json({ error: 'Authentication required' });
  next();
};

// Перевіряє окремий Bearer-токен voice-agent інтеграції та не приймає інші схеми Authorization.
export const requireVoiceAgentIntegration = (req: Request, res: Response, next: NextFunction) => {
  if (!voiceIntegrationConfigured()) return res.status(503).json({ error: 'Voice Agent integration is not configured' });
  const authorization = req.headers.authorization || '';
  const match = /^Bearer ([^\s]+)$/.exec(authorization);
  if (!match || !integrationTokenMatches(match[1])) {
    return res.status(401).json({ error: 'integration_authentication_required' });
  }
  next();
};
