import { useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { api } from '../api/client';
import { useTranslation } from 'react-i18next';

type Place = { place_id: string; name: string; address: string };

export default function MapSearchBox(){
  const { t } = useTranslation();
  const [q, setQ] = useState(() => t('maps.defaultQuery'));
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
    if(!ids.length) return alert(t('maps.selectFirst'));
    setBulkLoading(true);
    try {
      const res = await api.post('/api/places/import-bulk', { place_ids: ids });
      alert(t('maps.imported', { count: res.data.imported.filter((x:any)=>x.ok).length }));
    } finally { setBulkLoading(false); }
  };

  return (
    <Card>
      <h1>{t('maps.title')}</h1>
      <div className="responsive-form">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder={t('maps.placeholder')} style={{flex:1}} />
        <Button onClick={search} disabled={loading}>{loading?t('common.loading'):t('actions.search')}</Button>
        <Button onClick={importSelected} disabled={bulkLoading}>{bulkLoading?t('common.importing'):t('maps.importSelected')}</Button>
      </div>
      <ul style={{listStyle:'none', padding:0, margin:0, display:'grid', gap:8}}>
        {items.map(p => (
          <li className="map-result" key={p.place_id}>
            <input
              type="checkbox"
              checked={!!sel[p.place_id]}
              onChange={()=>toggle(p.place_id)}
              aria-labelledby={`place-name-${p.place_id}`}
              title={t('maps.selectPlace', { name: p.name })}
            />
            <div><strong id={`place-name-${p.place_id}`}>{p.name}</strong><div style={{opacity:.7}}>{p.address}</div></div>
            <Button onClick={async()=>{
              await api.post('/api/places/import', { place_id: p.place_id });
              alert(t('maps.clientCreated'));
            }}>{t('maps.addClient')}</Button>
          </li>
        ))}
      </ul>
    </Card>
  );
}
