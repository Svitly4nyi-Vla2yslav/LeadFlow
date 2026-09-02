import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { api } from '../api/client';
import { Client, CONTACT_CHANNELS, CRM_STATUSES, ContactChannel, LOST_REASONS, Message } from '../types';

const emptyMessage = { channel: 'email' as ContactChannel, direction: 'out' as 'in' | 'out', body: '' };
const fields: Array<[keyof Client, string, string]> = [
  ['company', 'Company *', 'text'], ['branche', 'Branche', 'text'], ['ort', 'Ort', 'text'], ['website', 'Website', 'url'],
  ['contactPerson', 'Contact Person', 'text'], ['phone', 'Phone', 'tel'], ['email', 'Email', 'email']
];

export default function ClientDetail() {
  const { id } = useParams();
  const [client, setClient] = useState<Client | null>(null);
  const [draft, setDraft] = useState<Partial<Client>>({});
  const [message, setMessage] = useState(emptyMessage);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const load = useCallback(async () => {
    try {
      const response = await api.get(`/api/clients/${id}`);
      setClient(response.data);
      setDraft(response.data);
      setError('');
    } catch { setError('Lead nicht gefunden oder API nicht erreichbar.'); }
  }, [id]);
  useEffect(() => { load(); }, [load]);

  const set = (key: keyof Client, value: unknown) => setDraft(current => ({ ...current, [key]: value }));

  const save = async (event: FormEvent) => {
    event.preventDefault(); setError(''); setNotice('');
    try {
      await api.patch(`/api/clients/${id}`, draft);
      setNotice('Lead und CRM-Ereignis wurden gespeichert.');
      load();
    } catch (exception: any) { setError(exception.response?.data?.error || 'Änderungen konnten nicht gespeichert werden.'); }
  };

  const addMessage = async (event: FormEvent) => {
    event.preventDefault(); setError('');
    try {
      await api.post('/api/messages', { clientId: id, ...message });
      setMessage(emptyMessage);
      setNotice('Kontaktprotokoll gespeichert. CRM-Status nur ändern, wenn die Statusbedingungen erfüllt sind.');
      load();
    } catch (exception: any) { setError(exception.response?.data?.error || 'Kontaktprotokoll konnte nicht gespeichert werden.'); }
  };

  const timeline = useMemo(() => {
    if (!client) return [];
    return [
      ...(client.statusHistory || []).map(event => ({ key: `s-${event.occurredAt}-${event.status}`, date: event.occurredAt, title: `Status: ${event.status}`, detail: event.summary || event.lostReason || '' })),
      ...(client.messages || []).map((item: Message) => ({ key: `m-${item.id}`, date: item.createdAt, title: `${item.direction === 'out' ? 'Outbound' : 'Inbound'} · ${item.channel}`, detail: item.body }))
    ].sort((a, b) => b.date.localeCompare(a.date));
  }, [client]);

  if (!client && !error) return <Card>Lead wird geladen…</Card>;
  if (!client) return <Card><p role="alert">{error}</p><Link to="/leads">Zurück zu Leads</Link></Card>;

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div><Link to="/leads">← Leads</Link><h2>{client.company}</h2><p style={{ opacity: .68 }}>Lead ID: {client.id}</p></div>
      {(error || notice) && <Card><p role="status" style={{ margin: 0, color: error ? '#fca5a5' : '#86efac' }}>{error || notice}</p></Card>}
      <form onSubmit={save} className="detail-grid">
        <Card>
          <h3 style={{ marginTop: 0 }}>Wer ist der Lead?</h3>
          <div className="field-grid">
            {fields.map(([key, label, type]) => <label key={key}>{label}<input type={type} value={String(draft[key] || '')} onChange={event => set(key, event.target.value)} required={key === 'company'} /></label>)}
          </div>
        </Card>
        <Card>
          <h3 style={{ marginTop: 0 }}>Was wurde getan?</h3>
          <div className="field-grid">
            <label>CRM Status<select value={draft.crmStatus} onChange={event => set('crmStatus', event.target.value)}>{CRM_STATUSES.map(status => <option key={status}>{status}</option>)}</select></label>
            <label>Contact Channel<select value={draft.contactChannel || ''} onChange={event => set('contactChannel', event.target.value)}><option value="">nicht verifiziert</option>{CONTACT_CHANNELS.map(channel => <option key={channel}>{channel}</option>)}</select></label>
            <label>Last Contact Date<input type="date" value={draft.lastContactDate || ''} onChange={event => set('lastContactDate', event.target.value)} /></label>
            <label>Offer Amount, EUR<input type="number" min="0" step="0.01" value={draft.offerAmount ?? ''} onChange={event => set('offerAmount', event.target.value)} /></label>
            <label className="span-2">Audit Problem<textarea value={draft.auditProblem || ''} onChange={event => set('auditProblem', event.target.value)} placeholder="Nur konkret bestätigter Punkt, keine Vermutung" /></label>
            <label className="span-2">Proposed Solution<textarea value={draft.proposedSolution || ''} onChange={event => set('proposedSolution', event.target.value)} /></label>
          </div>
        </Card>
        <Card>
          <h3 style={{ marginTop: 0 }}>Was ist als Nächstes zu tun?</h3>
          <div className="field-grid">
            <label>Next Follow-up Date<input type="date" value={draft.nextFollowUpDate || ''} onChange={event => set('nextFollowUpDate', event.target.value)} /></label>
            <label>Lost Reason<select value={draft.lostReason || ''} onChange={event => set('lostReason', event.target.value)}><option value="">—</option>{LOST_REASONS.map(reason => <option key={reason}>{reason}</option>)}</select></label>
            <label className="span-2">Notes / result / client need / next action<textarea rows={5} value={draft.notes || ''} onChange={event => set('notes', event.target.value)} /></label>
          </div>
          <p style={{ opacity: .65, fontSize: 13 }}>AUDITED: bestätigtes Problem. CONTACTED: Kanal + Datum + Inhalt. CALL: Ergebnis + Bedarf + nächste Aktion. OFFER/WON: Betrag + Details. FOLLOW-UP: beide Datumsfelder + Grund.</p>
          <Button type="submit">Änderungen speichern</Button>
        </Card>
      </form>

      <div className="detail-grid">
        <Card>
          <h3 style={{ marginTop: 0 }}>Kontakt protokollieren</h3>
          <form onSubmit={addMessage} className="field-grid">
            <label>Kanal<select value={message.channel} onChange={event => setMessage({ ...message, channel: event.target.value as ContactChannel })}>{CONTACT_CHANNELS.map(channel => <option key={channel}>{channel}</option>)}</select></label>
            <label>Richtung<select value={message.direction} onChange={event => setMessage({ ...message, direction: event.target.value as 'in' | 'out' })}><option value="out">Outbound</option><option value="in">Inbound</option></select></label>
            <label className="span-2">Was wurde gesendet / gesagt?<textarea required value={message.body} onChange={event => setMessage({ ...message, body: event.target.value })} /></label>
            <Button type="submit">Protokoll speichern</Button>
          </form>
        </Card>
        <Card>
          <h3 style={{ marginTop: 0 }}>Timeline</h3>
          {!timeline.length && <p>Keine Ereignisse.</p>}
          <div className="timeline">{timeline.map(item => <div key={item.key}><strong>{item.title}</strong><small>{new Date(item.date).toLocaleString('de-DE')}</small>{item.detail && <p>{item.detail}</p>}</div>)}</div>
        </Card>
      </div>
    </div>
  );
}
