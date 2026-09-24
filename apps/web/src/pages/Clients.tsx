import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import { api } from '../api/client';
import { Client } from '../types';
import { useTranslation } from 'react-i18next';

export default function Clients() {
  const { t, i18n } = useTranslation();
  const [items, setItems] = useState<Client[]>([]);
  const [error, setError] = useState('');
  useEffect(() => { api.get('/api/clients', { params: { status: 'WON' } }).then(response => setItems(response.data)).catch(() => setError(t('errors.apiUnavailable'))); }, [t]);
  return <Card>
    <h1>{t('clients.title')}</h1>
    <p className="muted">{t('clients.subtitle')} <Link to="/leads">{t('nav.leads')}</Link>.</p>
    {error && <p role="alert">{error}</p>}
    <div className="table-scroll"><table className="data-table">
      <thead><tr><th>{t('lead.company')}</th><th>{t('lead.contact')}</th><th>{t('lead.nextAction')}</th><th>{t('clients.value')}</th></tr></thead>
      <tbody>
        {!items.length && <tr><td colSpan={4}>{t('clients.empty')}</td></tr>}
        {items.map(client => <tr key={client.id}><td><Link to={`/clients/${client.id}`}><strong>{client.company}</strong></Link><br /><small>{client.ort || '—'}</small></td><td>{client.contactPerson || '—'}<br /><small>{client.email || client.phone || '—'}</small></td><td>{client.notes || '—'}</td><td>{client.offerAmount ? `${client.offerAmount.toLocaleString(i18n.language)} €` : '—'}</td></tr>)}
      </tbody>
    </table></div>
  </Card>;
}
