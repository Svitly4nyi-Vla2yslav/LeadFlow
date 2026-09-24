import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { api } from '../api/client';
import { CallTask, Client, CONTACT_CHANNELS, CRM_STATUSES, ContactChannel, LOST_REASONS, Message } from '../types';

const emptyMessage = { channel: 'email' as ContactChannel, direction: 'out' as 'in' | 'out', body: '' };
const emptyCallDraft = { callObjective: '', offerFocus: '', operatorNote: '', scheduledAt: '' };
const readinessLabels: Record<string, string> = {
  missing_phone: 'Telefonnummer fehlt',
  unusable_phone: 'Telefonnummer ist nicht verwendbar',
  missing_call_objective: 'Anrufziel fehlt'
};
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
  const [handoffState, setHandoffState] = useState<'ready' | 'opening' | 'error'>('ready');
  const [handoffError, setHandoffError] = useState('');
  const [callTask, setCallTask] = useState<CallTask | null>(null);
  const [callDraft, setCallDraft] = useState(emptyCallDraft);
  const [callTaskBusy, setCallTaskBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const [clientResponse, tasksResponse] = await Promise.all([
        api.get(`/api/clients/${id}`),
        api.get('/api/call-tasks', { params: { leadId: id } })
      ]);
      setClient(clientResponse.data);
      setDraft(clientResponse.data);
      const active = (tasksResponse.data as CallTask[]).find(task => !['COMPLETED', 'FAILED', 'CANCELLED'].includes(task.status)) || null;
      setCallTask(active);
      setCallDraft(active ? {
        callObjective: active.callObjective,
        offerFocus: active.offerFocus || '',
        operatorNote: active.operatorNote || '',
        scheduledAt: active.scheduledAt ? active.scheduledAt.slice(0, 16) : ''
      } : emptyCallDraft);
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

  const callWithEmma = async () => {
    if (handoffState === 'opening') return;
    setHandoffState('opening');
    setHandoffError('');
    try {
      const response = await api.post('/api/voice-agent/handoff', { leadId: client?.id });
      const destination = new URL(response.data.voiceAgentAppUrl);
      destination.searchParams.set('handoff', response.data.handoffToken);
      const opened = window.open(destination.toString(), '_blank');
      if (!opened) throw new Error('Der Browser hat das neue Emma-Fenster blockiert. Bitte Pop-ups erlauben.');
      opened.opener = null;
      setHandoffState('ready');
    } catch (exception: any) {
      setHandoffState('error');
      setHandoffError(exception.response?.data?.error || exception.message || 'Emma konnte nicht geöffnet werden.');
    }
  };

  const prepareCall = async (event: FormEvent) => {
    event.preventDefault();
    if (callTaskBusy || !client) return;
    setCallTaskBusy(true); setError(''); setNotice('');
    try {
      const payload = {
        ...callDraft,
        scheduledAt: callDraft.scheduledAt ? new Date(callDraft.scheduledAt).toISOString() : undefined
      };
      const response = callTask
        ? await api.patch(`/api/call-tasks/${callTask.id}`, payload)
        : await api.post('/api/call-tasks', { leadId: client.id, ...payload });
      setCallTask(response.data);
      setNotice(response.data.status === 'READY'
        ? 'Anruf ist vorbereitet. Emma kann mit diesem Lead-Kontext geöffnet werden.'
        : 'Entwurf gespeichert. Bitte die fehlenden Angaben ergänzen.');
    } catch (exception: any) {
      setError(exception.response?.data?.error || 'Anruf konnte nicht vorbereitet werden.');
    } finally { setCallTaskBusy(false); }
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
      <div>
        <Link to="/leads">← Leads</Link>
        <div className="toolbar" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <div><h2>{client.company}</h2><p style={{ opacity: .68 }}>Lead ID: {client.id}</p></div>
          {callTask?.status === 'READY' && <Button type="button" onClick={callWithEmma} disabled={handoffState === 'opening'} aria-busy={handoffState === 'opening'}>
            {handoffState === 'opening' ? 'Emma wird geöffnet…' : handoffState === 'error' ? 'Fehler – erneut versuchen' : 'Mit Emma anrufen'}
          </Button>}
        </div>
      </div>
      {(error || notice || handoffError) && <Card><p role="status" style={{ margin: 0, color: error || handoffError ? '#fca5a5' : '#86efac' }}>{error || handoffError || notice}</p></Card>}
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

      <Card>
        <div className="toolbar" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <div><h3 style={{ margin: 0 }}>Emma Anruf</h3><p style={{ marginBottom: 0, opacity: .68 }}>CallTask: {callTask?.status || 'noch nicht angelegt'}</p></div>
          {callTask?.status === 'READY' && <span className="status-pill" style={{ color: '#86efac' }}>READY</span>}
        </div>
        <form onSubmit={prepareCall} className="field-grid" style={{ marginTop: 16 }}>
          <label>Telefon<input type="tel" value={client.phone || ''} readOnly aria-describedby="call-phone-help" /></label>
          <label>Geplanter Zeitpunkt<input type="datetime-local" value={callDraft.scheduledAt} onChange={event => setCallDraft({ ...callDraft, scheduledAt: event.target.value })} /></label>
          <label className="span-2">Anrufziel<textarea value={callDraft.callObjective} onChange={event => setCallDraft({ ...callDraft, callObjective: event.target.value })} placeholder="Was soll Emma in diesem Gespräch erreichen?" /></label>
          <label>Angebot / Fokus<textarea value={callDraft.offerFocus} onChange={event => setCallDraft({ ...callDraft, offerFocus: event.target.value })} /></label>
          <label>Interne Notiz<textarea value={callDraft.operatorNote} onChange={event => setCallDraft({ ...callDraft, operatorNote: event.target.value })} /></label>
          <div className="span-2" id="call-phone-help">
            {callTask?.readinessIssues?.length ? <p role="status" style={{ color: '#fca5a5' }}>Noch nicht bereit: {callTask.readinessIssues.map(issue => readinessLabels[issue] || issue).join(', ')}.</p> : null}
            {!client.phone && !callTask && <p role="status" style={{ color: '#fca5a5' }}>Noch nicht bereit: Telefonnummer fehlt. Lead zuerst oben aktualisieren.</p>}
            <Button type="submit" disabled={callTaskBusy}>{callTaskBusy ? 'Wird gespeichert…' : 'Anruf vorbereiten'}</Button>
          </div>
        </form>
        <div className="call-brief" aria-label="Call Brief">
          <h4>Call Brief</h4>
          <dl>
            <dt>Unternehmen</dt><dd>{client.company}</dd>
            <dt>Telefon</dt><dd>{client.phone || '—'}</dd>
            {client.contactPerson && <><dt>Kontaktperson</dt><dd>{client.contactPerson}</dd></>}
            <dt>Ziel</dt><dd>{callDraft.callObjective || '—'}</dd>
            {client.auditProblem && <><dt>Bekanntes Problem</dt><dd>{client.auditProblem}</dd></>}
            {client.proposedSolution && <><dt>Mögliche Lösung</dt><dd>{client.proposedSolution}</dd></>}
            {callDraft.offerFocus && <><dt>Angebot / Fokus</dt><dd>{callDraft.offerFocus}</dd></>}
          </dl>
        </div>
        {callTask?.status === 'READY' && <div style={{ marginTop: 14 }}><Button type="button" onClick={callWithEmma} disabled={handoffState === 'opening'}>
          {handoffState === 'opening' ? 'Emma wird geöffnet…' : 'Mit Emma anrufen'}
        </Button></div>}
      </Card>

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
