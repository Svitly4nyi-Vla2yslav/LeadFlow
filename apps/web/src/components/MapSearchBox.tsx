import { useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { api } from '../api/client';

type Place = { place_id: string; name: string; address: string };

export default function MapSearchBox(){
  const [q, setQ] = useState('Friseur Hildesheim');
  const [items, setItems] = useState<Place[]>([]);
  const [sel, setSel] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);

  const search = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/places/search', { params: { q } });
      setItems(res.data.results);
      setSel({});
    } finally { setLoading(false); }
  };

  const toggle = (id:string) => setSel(s => ({...s, [id]: !s[id]}));

  const importSelected = async () => {
    const ids = Object.keys(sel).filter(k => sel[k]);
    if(!ids.length) return alert('Спочатку відміть записи');
    setBulkLoading(true);
    try {
      const res = await api.post('/api/places/import-bulk', { place_ids: ids });
      alert(`Імпортовано: ${res.data.imported.filter((x:any)=>x.ok).length}`);
    } finally { setBulkLoading(false); }
  };

  return (
    <Card>
      <h3>Пошук бізнесів</h3>
      <div style={{display:'flex', gap:8, marginBottom:12}}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Physiotherapie Hildesheim" style={{flex:1}} />
        <Button onClick={search} disabled={loading}>{loading?'...':'Шукати'}</Button>
        <Button onClick={importSelected} disabled={bulkLoading}>{bulkLoading?'Імпорт...':'Імпортувати вибрані'}</Button>
      </div>
      <ul style={{listStyle:'none', padding:0, margin:0, display:'grid', gap:8}}>
        {items.map(p => (
          <li key={p.place_id} style={{display:'grid', gridTemplateColumns:'auto 1fr auto', alignItems:'center', gap:12, border:'1px solid rgba(255,255,255,.12)', borderRadius:12, padding:'10px 12px'}}>
            <input
              type="checkbox"
              checked={!!sel[p.place_id]}
              onChange={()=>toggle(p.place_id)}
              aria-labelledby={`place-name-${p.place_id}`}
              title={`Вибрати ${p.name}`}
            />
            <div><strong id={`place-name-${p.place_id}`}>{p.name}</strong><div style={{opacity:.7}}>{p.address}</div></div>
            <Button onClick={async()=>{
              await api.post('/api/places/import', { place_id: p.place_id });
              alert('Створено клієнта');
            }}>+ Клієнт</Button>
          </li>
        ))}
      </ul>
    </Card>
  );
}
