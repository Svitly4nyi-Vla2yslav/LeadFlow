import express from 'express';
import cors from 'cors';
import { ENV } from './env';
import clients from './routes/clients';
import messages from './routes/messages';
import places from './routes/places';
import placesImport from './routes/placesImport';
import exportCsv from './routes/export';

const app = express();
app.use(cors({ origin: ENV.ALLOWED_ORIGIN }));
app.use(express.json());

app.use('/api/clients', clients);
app.use('/api/messages', messages);
app.use('/api/places', places);
app.use('/api/places', placesImport); // /import, /import-bulk
app.use('/api/export', exportCsv);    // /clients.csv

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.listen(ENV.PORT, () => console.log(`Server on :${ENV.PORT}`));
