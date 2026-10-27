import { Router } from 'express';
import fetch from 'node-fetch';
import { ENV } from '../env';

const r = Router();

/**
 * Шукає місця за непорожнім query-параметром q через Google Places Text Search.
 * У відповідь залишає лише поля, потрібні CRM; відсутній API-ключ дає 500, порожній q — 400.
 *
 * @sideEffects Виконує зовнішній HTTP-запит до Google Maps API.
 */
r.get('/search', async (req, res) => {
  if (!ENV.GOOGLE_API_KEY) return res.status(500).json({ error: 'GOOGLE_API_KEY not set' });
  const q = String(req.query.q || '').trim();
  if (!q) return res.status(400).json({ error: 'q required' });

  const url = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
  url.searchParams.set('query', q);
  url.searchParams.set('key', ENV.GOOGLE_API_KEY);

  try {
    const rr = await fetch(url);
    const data: any = await rr.json();
    const results = (data.results || []).map((p: any) => ({
      place_id: p.place_id,
      name: p.name,
      address: p.formatted_address,
      rating: p.rating,
      types: p.types,
      location: p.geometry?.location
    }));
    res.json({ results });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

/**
 * Завантажує обмежений набір контактних деталей для place id із параметра маршруту.
 * fields явно звужує відповідь до назви, адреси, сайту, телефону та типів.
 *
 * @sideEffects Виконує зовнішній HTTP-запит до Google Maps API.
 */
r.get('/details/:id', async (req, res) => {
  if (!ENV.GOOGLE_API_KEY) return res.status(500).json({ error: 'GOOGLE_API_KEY not set' });
  const id = req.params.id;
  const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
  url.searchParams.set('place_id', id);
  url.searchParams.set('fields', 'place_id,name,formatted_address,website,formatted_phone_number,types');
  url.searchParams.set('key', ENV.GOOGLE_API_KEY);

  try {
    const rr = await fetch(url);
    const data: any = await rr.json();
    res.json({ result: data.result });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default r;
