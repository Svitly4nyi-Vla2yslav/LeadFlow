import { Router } from 'express'; import { db, addClient } from '../db/memory';
const r = Router();
r.get('/', (_req,res)=>res.json(db.clients));
r.post('/', (req,res)=>{ const { name, email, phone, website, notes, tags }=req.body; if(!name) return res.status(400).json({error:'name required'}); const item=addClient({name,email,phone,website,notes,tags}); res.json(item); });
r.get('/:id', (req,res)=>{ const item=db.clients.find(c=>c.id===req.params.id); if(!item) return res.status(404).json({error:'not found'}); res.json(item); });
export default r;
