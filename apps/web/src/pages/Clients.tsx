import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import { api } from '../api/client';
import { Client } from '../types';

export default function Clients() {
  const [items, setItems] = useState<Client[]>([]);
  const [error, setError] = useState('');
  useEffect(() => { api.get('/api/clients', { params: { status: 'WON' } }).then(response => setItems(response.data)).catch(() => setError('API nicht erreichbar.')); }, []);
  return <Card style={{ overflowX: 'auto' }}>
    <h2 style={{ marginTop: 0 }}>Kunden</h2>
    <p style={{ opacity: .7 }}>Nur gewonnene Leads (WON). Neue Interessenten werden unter <Link to="/leads">Leads / CRM</Link> verwaltet.</p>
    {error && <p role="alert">{error}</p>}
    <table className="data-table">
      <thead><tr><th>Company</th><th>Kontakt</th><th>Leistung / nächster Schritt</th><th>Wert</th></tr></thead>
      <tbody>
        {!items.length && <tr><td colSpan={4}>Noch keine WON-Kunden.</td></tr>}
        {items.map(client => <tr key={client.id}><td><Link to={`/clients/${client.id}`}><strong>{client.company}</strong></Link><br /><small>{client.ort || '—'}</small></td><td>{client.contactPerson || '—'}<br /><small>{client.email || client.phone || '—'}</small></td><td>{client.notes || '—'}</td><td>{client.offerAmount ? `${client.offerAmount.toLocaleString('de-DE')} €` : '—'}</td></tr>)}
      </tbody>
    </table>
  </Card>;
}
