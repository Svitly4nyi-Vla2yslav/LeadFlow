import { randomUUID } from 'node:crypto';
export type Client={id:string;name:string;email?:string;phone?:string;website?:string;notes?:string;tags?:string[]};
export type Message={id:string;clientId:string;channel:'email'|'sms'|'whatsapp'|'call';direction:'in'|'out';body:string;createdAt:string};
export const db={ clients:[] as Client[], messages:[] as Message[] };

export const findClient = (name?:string, website?:string) => {
  const n=(name||'').trim().toLowerCase(), w=(website||'').trim().toLowerCase();
  return db.clients.find(c => c.name.trim().toLowerCase()===n && (c.website||'').trim().toLowerCase()===w);
};
export const addClient=(data:Omit<Client,'id'>)=>{ 
  const dup=findClient(data.name, data.website);
  if(dup) return dup;
  const item={ id:randomUUID(), ...data }; db.clients.push(item); return item; 
};
export const addMessage=(data:Omit<Message,'id'|'createdAt'>)=>{
  const item={ id:randomUUID(), createdAt:new Date().toISOString(), ...data }; db.messages.push(item); return item;
};
