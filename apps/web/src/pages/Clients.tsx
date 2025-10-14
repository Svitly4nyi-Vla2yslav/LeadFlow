import { useEffect, useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { api } from '../api/client';
type Client={id:string;name:string;website?:string;phone?:string;notes?:string;tags?:string[]};

export default function Clients(){
  const [items,setItems]=useState<Client[]>([]);
  const [name,setName]=useState('');
  const load=()=>api.get('/api/clients').then(r=>setItems(r.data));
  useEffect(()=>{ load(); },[]);
  const add=async()=>{ if(!name.trim())return; await api.post('/api/clients',{name}); setName(''); load(); };

  const exportCsv=()=>{ window.location.href = (import.meta.env.VITE_API_URL||'http://localhost:3001') + '/api/export/clients.csv'; };

  return (
    <Card>
      <h2>Клієнти</h2>
      <div style={{display:'flex',gap:8,marginBottom:12}}>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Назва" />
        <Button onClick={add}>Додати</Button>
        <Button onClick={exportCsv}>Експорт CSV</Button>
      </div>
      <table style={{width:'100%', borderCollapse:'collapse'}}>
        <thead><tr><th>Назва</th><th>Сайт</th><th>Телефон</th><th>Теги</th></tr></thead>
        <tbody>
          {items.map(c=>(
            <tr key={c.id} style={{borderTop:'1px solid rgba(255,255,255,.12)'}}>
              <td>{c.name}</td>
              <td>{c.website ? <a href={c.website} target="_blank" rel="noreferrer">{c.website}</a> : '—'}</td>
              <td>{c.phone||'—'}</td>
              <td>{(c.tags||[]).slice(0,4).join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
