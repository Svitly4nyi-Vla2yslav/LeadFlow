import { Router } from 'express'; import { db, addMessage } from '../db/memory';
const r = Router();
r.get('/', (req,res)=>{ const clientId=req.query.clientId as string|undefined; const list=clientId?db.messages.filter(m=>m.clientId===clientId):db.messages; res.json(list); });
r.post('/', (req,res)=>{ const { clientId, channel, direction, body }=req.body; if(!clientId||!channel||!direction||!body) return res.status(400).json({error:'missing fields'}); const item=addMessage({clientId,channel,direction,body}); res.json(item); });
export default r;
