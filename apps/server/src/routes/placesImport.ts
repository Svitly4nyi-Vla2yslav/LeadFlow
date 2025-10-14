import { Router } from 'express';
import fetch from 'node-fetch';
import { ENV } from '../env';
import { addClient } from '../db/memory';

const r = Router();

async function fetchPlace(place_id:string){
  const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
  url.searchParams.set('place_id', place_id);
  url.searchParams.set('fields', 'place_id,name,formatted_address,website,formatted_phone_number,types');
  url.searchParams.set('key', ENV.GOOGLE_API_KEY);
  const rr = await fetch(url); const data:any = await rr.json(); return data.result;
}

// POST /api/places/import { place_id: "..." }
r.post('/import', async (req, res) => {
  try {
    if (!ENV.GOOGLE_API_KEY) return res.status(500).json({ error: 'GOOGLE_API_KEY not set' });
    const place_id = String(req.body?.place_id || '');
    if (!place_id) return res.status(400).json({ error: 'place_id required' });
    const p = await fetchPlace(place_id);
    if (!p) return res.status(404).json({ error: 'place not found' });
    const created = addClient({ name:p.name, website:p.website, phone:p.formatted_phone_number, notes:p.formatted_address, tags:p.types });
    res.json({ created, source:{ place_id } });
  } catch (e:any) { res.status(500).json({ error: e.message }); }
});

// POST /api/places/import-bulk { place_ids: ["...","..."] }
r.post('/import-bulk', async (req, res) => {
  try {
    if (!ENV.GOOGLE_API_KEY) return res.status(500).json({ error: 'GOOGLE_API_KEY not set' });
    const ids = Array.isArray(req.body?.place_ids) ? req.body.place_ids as string[] : [];
    if (!ids.length) return res.status(400).json({ error: 'place_ids[] required' });
    const out:any[]=[];
    for(const id of ids){
      try{
        const p=await fetchPlace(id);
        if(!p) continue;
        const created=addClient({ name:p.name, website:p.website, phone:p.formatted_phone_number, notes:p.formatted_address, tags:p.types });
        out.push({ ok:true, id, name:created.name });
      }catch(e:any){
        out.push({ ok:false, id, error: e.message });
      }
    }
    res.json({ imported: out });
  } catch (e:any) { res.status(500).json({ error: e.message }); }
});

export default r;
