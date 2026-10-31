import express from 'express';
import cors from 'cors';
import { ENV } from './env';
import clients from './routes/clients';
import messages from './routes/messages';
import places from './routes/places';
import placesImport from './routes/placesImport';
import exportCsv from './routes/export';
import dashboard from './routes/dashboard';
import voiceAgent from './routes/voiceAgent';
import voiceAgentHandoff from './routes/voiceAgentHandoff';
import callTasks from './routes/callTasks';
import { authRouter, requireAuth, requireVoiceAgentIntegration } from './auth';

/**
 * Формує Express-застосунок LeadFlow: підключає загальні middleware, відкриті маршрути,
 * інтеграційний API та захищені CRM-маршрути. Порядок монтування є частиною контракту:
 * перевірки інтеграції й сесії виконуються до відповідних обробників.
 */
const app = express();
app.disable('x-powered-by');
app.use(cors({ origin: ENV.ALLOWED_ORIGIN, credentials: true }));
app.use(express.json({ limit: '1mb' }));

// Health-check залишається публічним і повідомляє тип активного сховища без читання CRM-даних.
app.get('/api/health', (_req, res) => res.json({ ok: true, storage: 'persistent-json' }));
// Авторизація та webhook голосового агента мають власні правила доступу й монтуються до загального requireAuth.
app.use('/api/auth', authRouter);
app.use('/api/integrations/voice-agent', requireVoiceAgentIntegration, voiceAgent);
// Усі маршрути нижче цього middleware вимагають чинної cookie-сесії власника CRM.
app.use('/api', requireAuth);
app.use('/api/voice-agent', voiceAgentHandoff);
app.use('/api/call-tasks', callTasks);
app.use('/api/clients', clients);
app.use('/api/messages', messages);
app.use('/api/places', places);
app.use('/api/places', placesImport);
app.use('/api/export', exportCsv);
app.use('/api/dashboard', dashboard);

// Невідомі адреси завершуються контрольованою JSON-відповіддю після перевірки всіх відомих маршрутів.
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

export default app;
