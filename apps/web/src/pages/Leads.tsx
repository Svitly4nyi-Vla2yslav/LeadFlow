import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { api } from '../api/client';
import { CallTask, Client, CRM_STATUSES, CrmStatus } from '../types';

const statusColor: Record<CrmStatus, string> = {
  NEW: '#94a3b8', AUDITED: '#38bdf8', CONTACTED: '#818cf8', REPLY: '#a78bfa', CALL: '#f59e0b', OFFER: '#fb923c', 'FOLLOW-UP': '#facc15', WON: '#22c55e', LOST: '#ef4444'
};
const emptyDraft = { company: '', phone: '', contactPerson: '', website: '', branche: '', ort: '', email: '', source: '', preferredLanguage: '', decisionMaker: '', currentSituation: '', painPoints: '', auditProblem: '', proposedSolution: '', emmaFocus: '', offerFocus: '', doNotMention: '', notes: '', callObjective: '' };

export default function Leads() {
  const { t } = useTranslation(); const navigate = useNavigate();
  const [items, setItems] = useState<Client[]>([]); const [tasks, setTasks] = useState<CallTask[]>([]); const [draft, setDraft] = useState(emptyDraft);
  const [query, setQuery] = useState(''); const [status, setStatus] = useState(''); const [overdueOnly, setOverdueOnly] = useState(false);
  const [error, setError] = useState(''); const [notice, setNotice] = useState(''); const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false);
  const [launchingLeadId, setLaunchingLeadId] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try { const [leads, calls] = await Promise.all([api.get('/api/clients', { params: { q: query || undefined, status: status || undefined, followUp: overdueOnly ? 'overdue' : undefined } }), api.get('/api/call-tasks')]); setItems(leads.data); setTasks(calls.data); setError(''); }
    catch { setError(t('errors.apiUnavailable')); } finally { setLoading(false); }
  }, [query, status, overdueOnly, t]);
  useEffect(() => { const timer = window.setTimeout(load, 180); return () => window.clearTimeout(timer); }, [load]);
  const taskByLead = useMemo(() => Object.fromEntries([...tasks].reverse().map(task => [task.leadId, task])), [tasks]);
  const set = (key: keyof typeof emptyDraft, value: string) => setDraft(current => ({ ...current, [key]: value }));

  const add = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); if (!draft.company.trim() || saving) return;
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null; const action = submitter?.value || 'save';
    setSaving(true); setError(''); setNotice('');
    try {
      const { callObjective, ...leadDraft } = draft;
      let response = await api.post('/api/clients', { ...leadDraft, preferredLanguage: leadDraft.preferredLanguage || undefined, crmStatus: 'NEW' });
      const wasDuplicate = Boolean(response.data.duplicate);
      if (wasDuplicate) response = await api.patch(`/api/clients/${response.data.id}`, { ...leadDraft, preferredLanguage: leadDraft.preferredLanguage || undefined });
      const leadId = response.data.id as string;
      if (action === 'prepare') {
        await api.post('/api/call-tasks', { leadId, callObjective, offerFocus: leadDraft.offerFocus, operatorNote: leadDraft.emmaFocus });
        navigate(`/clients/${leadId}#emma`);
      } else { setNotice(wasDuplicate ? t('lead.updatedExisting') : t('lead.saved')); setDraft(emptyDraft); await load(); }
    } catch (exception: any) { setError(exception.response?.data?.error || t('errors.leadSave')); } finally { setSaving(false); }
  };

  const callWithEmma = async (leadId: string) => {
    if (launchingLeadId) return;
    setLaunchingLeadId(leadId); setError('');
    try {
      const response = await api.post('/api/voice-agent/handoff', { leadId });
      const destination = new URL(response.data.voiceAgentAppUrl);
      destination.searchParams.set('handoff', response.data.handoffToken);
      const opened = window.open(destination.toString(), '_blank');
      if (!opened) throw new Error('popup_blocked');
      opened.opener = null;
    } catch (exception: any) { setError(exception.message === 'popup_blocked' ? t('errors.popupBlocked') : t('errors.emmaOpen')); }
    finally { setLaunchingLeadId(''); }
  };

  return <div className="page-stack">
    <Card id="create-lead"><h1>{t('lead.title')}</h1><p className="muted">{t('lead.subtitle')}</p><form onSubmit={add} className="progressive-form">
      <details open><summary>{t('lead.stepBasic')}</summary><div className="field-grid section-body"><label>{t('lead.company')} *<input value={draft.company} onChange={e => set('company', e.target.value)} required /></label><label>{t('lead.phone')}<input type="tel" value={draft.phone} onChange={e => set('phone', e.target.value)} /></label><label>{t('lead.contactPerson')}<input value={draft.contactPerson} onChange={e => set('contactPerson', e.target.value)} /></label><label>{t('lead.website')}<input type="url" value={draft.website} onChange={e => set('website', e.target.value)} /></label></div></details>
      <details><summary>{t('lead.stepContext')}</summary><div className="field-grid section-body"><label>{t('lead.industry')}<input value={draft.branche} onChange={e => set('branche', e.target.value)} /></label><label>{t('lead.location')}<input value={draft.ort} onChange={e => set('ort', e.target.value)} /></label><label>{t('lead.email')}<input type="email" value={draft.email} onChange={e => set('email', e.target.value)} /></label><label>{t('lead.source')}<input value={draft.source} onChange={e => set('source', e.target.value)} /></label><label>{t('lead.preferredLanguage')}<select value={draft.preferredLanguage} onChange={e => set('preferredLanguage', e.target.value)}><option value="">—</option>{['de','uk','ru','en'].map(value => <option key={value} value={value}>{t(`language.${value}`)}</option>)}</select></label><label>{t('lead.decisionMaker')}<input value={draft.decisionMaker} onChange={e => set('decisionMaker', e.target.value)} /></label><label className="span-2">{t('lead.currentSituation')}<textarea value={draft.currentSituation} onChange={e => set('currentSituation', e.target.value)} /></label><label>{t('lead.painPoints')}<textarea value={draft.painPoints} onChange={e => set('painPoints', e.target.value)} /></label><label>{t('lead.auditProblem')}<textarea value={draft.auditProblem} onChange={e => set('auditProblem', e.target.value)} /></label><label>{t('lead.proposedSolution')}<textarea value={draft.proposedSolution} onChange={e => set('proposedSolution', e.target.value)} /></label></div></details>
      <details><summary>{t('lead.stepEmma')}</summary><div className="field-grid section-body"><label>{t('lead.offerFocus')}<textarea value={draft.offerFocus} onChange={e => set('offerFocus', e.target.value)} /></label><label>{t('lead.emmaFocus')}<textarea value={draft.emmaFocus} onChange={e => set('emmaFocus', e.target.value)} /></label><label>{t('lead.doNotMention')}<textarea value={draft.doNotMention} onChange={e => set('doNotMention', e.target.value)} /></label><label>{t('call.objective')}<textarea value={draft.callObjective} placeholder={t('call.objectivePlaceholder')} onChange={e => set('callObjective', e.target.value)} /></label><label className="span-2">{t('lead.notes')}<textarea value={draft.notes} onChange={e => set('notes', e.target.value)} /></label></div></details>
      <div className="form-actions"><Button name="action" value="save" disabled={saving}>{t('actions.saveLead')}</Button><Button name="action" value="prepare" disabled={saving}>{t('actions.savePrepare')}</Button></div>
    </form>{(error || notice) && <p role={error ? 'alert' : 'status'} className={error ? 'error-text' : 'success-text'}>{error || notice}</p>}</Card>

    <Card className="data-shortcut"><Link className="action-link" to="/data">{t('data.open')}</Link></Card>

    <Card><div className="toolbar"><input value={query} onChange={e => setQuery(e.target.value)} placeholder={t('lead.searchPlaceholder')} aria-label={t('lead.search')} /><select value={status} onChange={e => setStatus(e.target.value)} aria-label={t('lead.filterStatus')}><option value="">{t('status.all')}</option>{CRM_STATUSES.map(value => <option key={value} value={value}>{t(`status.${value}`)}</option>)}</select><label className="checkbox"><input type="checkbox" checked={overdueOnly} onChange={e => setOverdueOnly(e.target.checked)} /> {t('lead.overdueOnly')}</label></div></Card>

    <Card className="lead-list-card"><p className="muted list-count">{loading ? t('common.loading') : t('lead.count', { count: items.length })}</p>
      <table className="data-table desktop-only"><thead><tr><th>{t('lead.lead')}</th><th>{t('lead.industryLocation')}</th><th>{t('lead.contact')}</th><th>{t('lead.status')}</th><th>{t('lead.auditProblem')}</th><th>{t('lead.nextAction')}</th></tr></thead><tbody>{!loading && !items.length && <tr><td colSpan={6}>{t('lead.empty')}</td></tr>}{items.map(lead => <tr key={lead.id}><td><Link to={`/clients/${lead.id}`}><strong>{lead.company}</strong></Link><br/><small>{lead.website || t('common.notVerified')}</small></td><td>{lead.branche || '—'}<br/><small>{lead.ort || '—'}</small></td><td>{lead.contactPerson || '—'}<br/><small>{lead.email || lead.phone || '—'}</small></td><td><span className="status-pill" style={{color:statusColor[lead.crmStatus],borderColor:statusColor[lead.crmStatus]}}>{t(`status.${lead.crmStatus}`)}</span></td><td>{lead.auditProblem || '—'}</td><td>{lead.nextFollowUpDate && <><strong>{lead.nextFollowUpDate}</strong><br/></>}<small>{lead.notes || '—'}</small></td></tr>)}</tbody></table>
      <div className="mobile-lead-list mobile-only">{!loading && !items.length && <p>{t('lead.empty')}</p>}{items.map(lead => { const task = taskByLead[lead.id]; return <article className="lead-card" key={lead.id}><div className="lead-card-head"><div><h3>{lead.company}</h3><p>{[lead.branche,lead.ort].filter(Boolean).join(' · ') || '—'}</p></div><span className="status-pill" style={{color:statusColor[lead.crmStatus],borderColor:statusColor[lead.crmStatus]}}>{t(`status.${lead.crmStatus}`)}</span></div>{lead.phone && <a className="phone-link" href={`tel:${lead.phone}`}>{lead.phone}</a>}{lead.nextFollowUpDate && <p><strong>{t('lead.followUp')}:</strong> {lead.nextFollowUpDate}</p>}{lead.auditProblem && <p className="line-clamp">{lead.auditProblem}</p>}<p><strong>{t('call.readiness')}:</strong> {task ? t(`callStatus.${task.status}`) : t('call.notPrepared')}</p><div className="card-actions"><Link className="action-link" to={`/clients/${lead.id}`}>{t('actions.open')}</Link>{task?.status === 'READY' ? <button className="action-link primary card-action-button" type="button" disabled={!!launchingLeadId} onClick={() => callWithEmma(lead.id)}>{launchingLeadId === lead.id ? t('call.opening') : t('call.callEmma')}</button> : <Link className="action-link primary" to={`/clients/${lead.id}#emma`}>{t('call.prepare')}</Link>}</div></article>; })}</div>
    </Card>
  </div>;
}
