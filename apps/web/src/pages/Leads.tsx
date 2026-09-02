import { FormEvent, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { api } from '../api/client';
import { Client, CRM_STATUSES, CrmStatus } from '../types';

const statusColor: Record<CrmStatus, string> = {
  NEW: '#94a3b8', AUDITED: '#38bdf8', CONTACTED: '#818cf8', REPLY: '#a78bfa',
  CALL: '#f59e0b', OFFER: '#fb923c', 'FOLLOW-UP': '#facc15', WON: '#22c55e', LOST: '#ef4444'
};
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function Leads() {
  const [items, setItems] = useState<Client[]>([]);
  const [draft, setDraft] = useState({ company: '', branche: '', ort: '', website: '' });
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [overdueOnly, setOverdueOnly] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/clients', { params: { q: query || undefined, status: status || undefined, followUp: overdueOnly ? 'overdue' : undefined } });
      setItems(response.data);
      setError('');
    } catch {
      setError('API nicht erreichbar. Bitte Backend und VITE_API_URL prüfen.');
    } finally { setLoading(false); }
  }, [query, status, overdueOnly]);

  useEffect(() => { const timer = window.setTimeout(load, 180); return () => window.clearTimeout(timer); }, [load]);

  const add = async (event: FormEvent) => {
    event.preventDefault();
    if (!draft.company.trim()) return;
    try {
      const response = await api.post('/api/clients', { ...draft, crmStatus: 'NEW' });
      setDraft({ company: '', branche: '', ort: '', website: '' });
      setError(response.data.duplicate ? 'Dieser Lead existiert bereits; es wurde kein Duplikat erstellt.' : '');
      load();
    } catch (exception: any) {
      setError(exception.response?.data?.error || 'Lead konnte nicht gespeichert werden');
    }
  };

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Card>
        <h2 style={{ marginTop: 0 }}>Leads / CRM</h2>
        <p style={{ opacity: .72 }}>Ein Hauptstatus pro Lead. Statuswechsel erfolgen im Lead-Profil und nur mit belegter Aktivität.</p>
        <form onSubmit={add} className="responsive-form">
          <input value={draft.company} onChange={event => setDraft({ ...draft, company: event.target.value })} placeholder="Company *" required />
          <input value={draft.branche} onChange={event => setDraft({ ...draft, branche: event.target.value })} placeholder="Branche" />
          <input value={draft.ort} onChange={event => setDraft({ ...draft, ort: event.target.value })} placeholder="Ort" />
          <input value={draft.website} onChange={event => setDraft({ ...draft, website: event.target.value })} placeholder="Website" />
          <Button type="submit">Als NEW hinzufügen</Button>
        </form>
        {error && <p role="alert" style={{ color: error.includes('Duplikat') ? '#fde68a' : '#fca5a5' }}>{error}</p>}
      </Card>

      <Card>
        <div className="toolbar">
          <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Firma, Ort, Branche, Kontakt suchen…" aria-label="Leads suchen" />
          <select value={status} onChange={event => setStatus(event.target.value)} aria-label="Status filtern">
            <option value="">Alle Status</option>
            {CRM_STATUSES.map(value => <option key={value}>{value}</option>)}
          </select>
          <label className="checkbox"><input type="checkbox" checked={overdueOnly} onChange={event => setOverdueOnly(event.target.checked)} /> Follow-up überfällig</label>
          <Button type="button" onClick={() => { window.location.href = `${apiUrl}/api/export/clients.csv`; }}>CSV exportieren</Button>
        </div>
      </Card>

      <Card style={{ overflowX: 'auto' }}>
        <p style={{ marginTop: 0, opacity: .7 }}>{loading ? 'Wird geladen…' : `${items.length} Lead(s)`}</p>
        <table className="data-table" style={{ minWidth: 980 }}>
          <thead><tr><th>Lead</th><th>Branche / Ort</th><th>Kontakt</th><th>Status</th><th>Bestätigter Audit-Punkt</th><th>Nächste Aktion</th></tr></thead>
          <tbody>
            {!loading && !items.length && <tr><td colSpan={6}>Keine Leads für diesen Filter.</td></tr>}
            {items.map(lead => (
              <tr key={lead.id}>
                <td><Link to={`/clients/${lead.id}`}><strong>{lead.company}</strong></Link><br /><small>{lead.website || 'nicht verifiziert'}</small></td>
                <td>{lead.branche || '—'}<br /><small>{lead.ort || '—'}</small></td>
                <td>{lead.contactPerson || '—'}<br /><small>{lead.email || lead.phone || '—'}</small></td>
                <td><span className="status-pill" style={{ color: statusColor[lead.crmStatus], borderColor: statusColor[lead.crmStatus] }}>{lead.crmStatus}</span></td>
                <td>{lead.auditProblem || '—'}</td>
                <td>{lead.nextFollowUpDate ? <><strong>{lead.nextFollowUpDate}</strong><br /></> : null}<small>{lead.notes || '—'}</small></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
