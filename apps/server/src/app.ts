import express from 'express';
import cors from 'cors';
import { ENV } from './env';
import clients from './routes/clients';
import messages from './routes/messages';
import places from './routes/places';
import placesImport from './routes/placesImport';
import exportCsv from './routes/export';
import dashboard from './routes/dashboard';

const app = express();
app.disable('x-powered-by');
app.use(cors({ origin: ENV.ALLOWED_ORIGIN }));
app.use(express.json({ limit: '1mb' }));

app.use('/api/clients', clients);
app.use('/api/messages', messages);
app.use('/api/places', places);
app.use('/api/places', placesImport);
app.use('/api/export', exportCsv);
app.use('/api/dashboard', dashboard);

app.get('/api/health', (_req, res) => res.json({ ok: true, storage: 'persistent-json' }));
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

export default app;
