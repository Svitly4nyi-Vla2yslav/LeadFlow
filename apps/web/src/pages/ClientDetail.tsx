import { FormEvent, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { api } from '../api/client';
import { CallBrief, CallTask, Client, CONTACT_CHANNELS, CRM_STATUSES, ContactChannel, LOST_REASONS, Message } from '../types';

const emptyMessage = { channel: 'email' as ContactChannel, direction: 'out' as 'in' | 'out', body: '' };
const emptyCallDraft = { callObjective: '', offerFocus: '', operatorNote: '', scheduledAt: '' };
const contactChannelKeys: Record<ContactChannel, string> = { email:'contactChannel.email', 'contact form':'contactChannel.contactForm', LinkedIn:'contactChannel.linkedin', WhatsApp:'contactChannel.whatsapp', 'phone/cold call':'contactChannel.phone' };
const lostReasonKeys = ['noNeed','noBudget','noReply','ownAgency','noAuthority','inactive','wrongTarget','other'] as const;
const feedbackFields: Array<[keyof NonNullable<CallTask['result']>, string]> = [
  ['outcome','feedback.outcome'], ['summary','feedback.summary'], ['clientNeed','feedback.clientNeed'], ['confirmedPainPoints','feedback.confirmedPainPoints'],
  ['interestLevel','feedback.interestLevel'], ['budgetSignal','feedback.budgetSignal'], ['decisionMakerStatus','feedback.decisionMakerStatus'],
  ['requestedInformation','feedback.requestedInformation'], ['nextAction','feedback.nextAction'], ['callbackAt','feedback.callbackAt'],
  ['calendarEventId','feedback.calendarEventId'], ['meetingStart','feedback.meetingStart'], ['meetingEnd','feedback.meetingEnd'], ['lostReason','feedback.lostReason']
];

function Section({ title, children, open = false, id }: { title: string; children: ReactNode; open?: boolean; id?: string }) {
  return <Card as="details" open={open} id={id} className="detail-section"><summary><strong>{title}</strong></summary><div className="section-body">{children}</div></Card>;
}

export default function ClientDetail() {
  const { id } = useParams(); const { t, i18n } = useTranslation();
  const [client, setClient] = useState<Client | null>(null); const [draft, setDraft] = useState<Partial<Client>>({});
  const [message, setMessage] = useState(emptyMessage); const [error, setError] = useState(''); const [notice, setNotice] = useState('');
  const [handoffState, setHandoffState] = useState<'ready'|'opening'|'error'>('ready'); const [handoffError, setHandoffError] = useState('');
  const [callTask, setCallTask] = useState<CallTask | null>(null); const [lastFeedback, setLastFeedback] = useState<CallTask | null>(null);
  const [callBrief, setCallBrief] = useState<CallBrief | null>(null);
  const [callDraft, setCallDraft] = useState(emptyCallDraft); const [callTaskBusy, setCallTaskBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const [clientResponse, tasksResponse] = await Promise.all([api.get(`/api/clients/${id}`), api.get('/api/call-tasks', { params: { leadId: id } })]);
      const tasks = tasksResponse.data as CallTask[]; const active = tasks.find(task => !['COMPLETED','FAILED','CANCELLED'].includes(task.status)) || null;
      setClient(clientResponse.data); setDraft(clientResponse.data); setCallTask(active); setLastFeedback(tasks.find(task => task.result && Object.keys(task.result).length) || null);
      setCallBrief(active ? (await api.get(`/api/call-tasks/${active.id}/brief`)).data : null);
      setCallDraft(active ? { callObjective: active.callObjective, offerFocus: active.offerFocus || '', operatorNote: active.operatorNote || '', scheduledAt: active.scheduledAt ? active.scheduledAt.slice(0,16) : '' } : { ...emptyCallDraft, offerFocus: clientResponse.data.offerFocus || '', operatorNote: clientResponse.data.emmaFocus || '' });
      setError('');
    } catch { setError(t('errors.leadLoad')); }
  }, [id, t]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { if (client && window.location.hash === '#emma') document.getElementById('emma')?.scrollIntoView({ behavior: 'smooth' }); }, [client]);
  const set = (key: keyof Client, value: unknown) => setDraft(current => ({ ...current, [key]: value }));

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(''); setNotice('');
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const prepareAfterSave = submitter?.value === 'prepare';
    try {
      const saved = await api.patch(`/api/clients/${id}`, draft);
      setClient(saved.data); setDraft(saved.data);
      if (!prepareAfterSave) { setNotice(t('lead.changesSaved')); return; }
      const payload = { ...callDraft, scheduledAt: callDraft.scheduledAt ? new Date(callDraft.scheduledAt).toISOString() : undefined };
      const prepared = callTask
        ? await api.patch(`/api/call-tasks/${callTask.id}`, payload)
        : await api.post('/api/call-tasks', { leadId: saved.data.id, ...payload });
      setCallTask(prepared.data);
      setCallBrief((await api.get(`/api/call-tasks/${prepared.data.id}/brief`)).data);
      setNotice(prepared.data.status === 'READY' ? t('call.preparedReady') : t('call.savedDraft', { issues: prepared.data.readinessIssues.map((issue: string) => t(`readiness.${issue}`)).join(', ') }));
      window.location.hash = 'emma';
    } catch { setError(prepareAfterSave ? t('errors.callPrepare') : t('errors.changesSave')); }
  };
  const addMessage = async (event: FormEvent) => { event.preventDefault(); setError(''); try { await api.post('/api/messages', { clientId: id, ...message }); setMessage(emptyMessage); setNotice(t('messages.saved')); await load(); } catch (exception: any) { setError(exception.response?.data?.error || t('errors.messageSave')); } };
  const callWithEmma = async () => {
    if (handoffState === 'opening') return; setHandoffState('opening'); setHandoffError('');
    try { const response = await api.post('/api/voice-agent/handoff', { leadId: client?.id }); const destination = new URL(response.data.voiceAgentAppUrl); destination.searchParams.set('handoff', response.data.handoffToken); const opened = window.open(destination.toString(), '_blank'); if (!opened) throw new Error(t('errors.popupBlocked')); opened.opener = null; setHandoffState('ready'); }
    catch (exception: any) { setHandoffState('error'); setHandoffError(exception.response?.data?.error || exception.message || t('errors.emmaOpen')); }
  };
  const prepareCall = async (event: FormEvent) => {
    event.preventDefault(); if (callTaskBusy || !client) return; setCallTaskBusy(true); setError(''); setNotice('');
    try { const payload = { ...callDraft, scheduledAt: callDraft.scheduledAt ? new Date(callDraft.scheduledAt).toISOString() : undefined }; const response = callTask ? await api.patch(`/api/call-tasks/${callTask.id}`, payload) : await api.post('/api/call-tasks', { leadId: client.id, ...payload }); setCallTask(response.data); setCallBrief((await api.get(`/api/call-tasks/${response.data.id}/brief`)).data); setNotice(response.data.status === 'READY' ? t('call.preparedReady') : t('call.savedDraft', { issues: response.data.readinessIssues.map((issue: string) => t(`readiness.${issue}`)).join(', ') })); }
    catch (exception: any) { setError(exception.response?.data?.error || t('errors.callPrepare')); } finally { setCallTaskBusy(false); }
  };

  const timeline = useMemo(() => !client ? [] : [...(client.statusHistory || []).map(event => ({ key:`s-${event.occurredAt}-${event.status}`, date:event.occurredAt, title:`${t('lead.status')}: ${t(`status.${event.status}`)}`, detail:event.summary || (event.lostReason ? t(`lostReason.${lostReasonKeys[LOST_REASONS.indexOf(event.lostReason)]}`) : '') })), ...(client.messages || []).map((item:Message) => ({ key:`m-${item.id}`, date:item.createdAt, title:`${t(`direction.${item.direction}`)} · ${t(contactChannelKeys[item.channel])}`, detail:item.body }))].sort((a,b) => b.date.localeCompare(a.date)), [client,t]);
  if (!client && !error) return <Card>{t('common.loading')}</Card>;
  if (!client) return <Card><p role="alert">{error}</p><Link to="/leads">{t('actions.backToLeads')}</Link></Card>;
  const result = lastFeedback?.result;

  return <div className="page-stack client-detail">
    <header className="detail-header"><div><Link to="/leads">← {t('nav.leads')}</Link><h1>{client.company}</h1><details className="technical-id"><summary>{t('common.technicalDetails')}</summary><code>{client.id}</code></details></div>{callTask?.status === 'READY' && <Button type="button" onClick={callWithEmma} disabled={handoffState === 'opening'}>{handoffState === 'opening' ? t('call.opening') : t('call.callEmma')}</Button>}</header>
    {(error || notice || handoffError) && <Card><p role={error || handoffError ? 'alert' : 'status'} className={error || handoffError ? 'error-text' : 'success-text'}>{error || handoffError || notice}</p></Card>}

    <form onSubmit={save} className="page-stack">
      <Section title={t('sections.overview')} open><div className="field-grid"><label>{t('lead.company')} *<input value={String(draft.company || '')} onChange={e=>set('company',e.target.value)} required /></label><label>{t('lead.status')}<select value={draft.crmStatus} onChange={e=>set('crmStatus',e.target.value)}>{CRM_STATUSES.map(value=><option key={value} value={value}>{t(`status.${value}`)}</option>)}</select></label><label>{t('lead.source')}<input value={draft.source || ''} onChange={e=>set('source',e.target.value)} /></label><label>{t('lead.preferredLanguage')}<select value={draft.preferredLanguage || ''} onChange={e=>set('preferredLanguage',e.target.value)}><option value="">—</option>{['de','uk','ru','en'].map(value=><option key={value} value={value}>{t(`language.${value}`)}</option>)}</select></label></div></Section>
      <Section title={t('sections.contact')} open><div className="field-grid"><label>{t('lead.contactPerson')}<input value={draft.contactPerson || ''} onChange={e=>set('contactPerson',e.target.value)} /></label><label>{t('lead.decisionMaker')}<input value={draft.decisionMaker || ''} onChange={e=>set('decisionMaker',e.target.value)} /></label><label>{t('lead.phone')}<input type="tel" value={draft.phone || ''} onChange={e=>set('phone',e.target.value)} /></label><label>{t('lead.email')}<input type="email" value={draft.email || ''} onChange={e=>set('email',e.target.value)} /></label><label>{t('lead.website')}<input type="url" value={draft.website || ''} onChange={e=>set('website',e.target.value)} /></label><label>{t('lead.location')}<input value={draft.ort || ''} onChange={e=>set('ort',e.target.value)} /></label></div></Section>
      <Section title={t('sections.businessContext')}><div className="field-grid"><label>{t('lead.industry')}<input value={draft.branche || ''} onChange={e=>set('branche',e.target.value)} /></label><label className="span-2">{t('lead.currentSituation')}<textarea value={draft.currentSituation || ''} onChange={e=>set('currentSituation',e.target.value)} /></label><label>{t('lead.painPoints')}<textarea value={draft.painPoints || ''} onChange={e=>set('painPoints',e.target.value)} /></label><label>{t('lead.auditProblem')}<textarea value={draft.auditProblem || ''} onChange={e=>set('auditProblem',e.target.value)} /></label><label>{t('lead.proposedSolution')}<textarea value={draft.proposedSolution || ''} onChange={e=>set('proposedSolution',e.target.value)} /></label><label>{t('lead.notes')}<textarea value={draft.notes || ''} onChange={e=>set('notes',e.target.value)} /></label></div></Section>
      <Section title={t('sections.emmaPreparation')}><div className="field-grid"><label>{t('lead.emmaFocus')}<textarea value={draft.emmaFocus || ''} onChange={e=>set('emmaFocus',e.target.value)} /></label><label>{t('lead.offerFocus')}<textarea value={draft.offerFocus || ''} onChange={e=>set('offerFocus',e.target.value)} /></label><label className="span-2">{t('lead.doNotMention')}<textarea value={draft.doNotMention || ''} onChange={e=>set('doNotMention',e.target.value)} /></label></div></Section>
      <Section title={t('sections.nextAction')}><div className="field-grid"><label>{t('lead.contactChannel')}<select value={draft.contactChannel || ''} onChange={e=>set('contactChannel',e.target.value)}><option value="">{t('common.notVerified')}</option>{CONTACT_CHANNELS.map(value=><option key={value} value={value}>{t(contactChannelKeys[value])}</option>)}</select></label><label>{t('lead.lastContactDate')}<input type="date" value={draft.lastContactDate || ''} onChange={e=>set('lastContactDate',e.target.value)} /></label><label>{t('lead.nextFollowUpDate')}<input type="date" value={draft.nextFollowUpDate || ''} onChange={e=>set('nextFollowUpDate',e.target.value)} /></label><label>{t('lead.offerAmount')}<input type="number" min="0" step="0.01" value={draft.offerAmount ?? ''} onChange={e=>set('offerAmount',e.target.value)} /></label><label>{t('lead.lostReason')}<select value={draft.lostReason || ''} onChange={e=>set('lostReason',e.target.value)}><option value="">—</option>{LOST_REASONS.map((value,index)=><option key={value} value={value}>{t(`lostReason.${lostReasonKeys[index]}`)}</option>)}</select></label></div></Section>
      <div className="sticky-actions"><Button type="submit" name="action" value="save">{t('actions.save')}</Button><Button type="submit" name="action" value="prepare">{t('actions.savePrepare')}</Button></div>
    </form>

    <Section title={t('sections.callTask')} open id="emma"><div className="section-heading"><span>{t('call.status')}: <strong>{callTask ? t(`callStatus.${callTask.status}`) : t('call.notPrepared')}</strong></span></div><form onSubmit={prepareCall} className="field-grid"><label>{t('lead.phone')}<input value={client.phone || ''} readOnly /></label><label>{t('call.scheduledAt')}<input type="datetime-local" value={callDraft.scheduledAt} onChange={e=>setCallDraft({...callDraft,scheduledAt:e.target.value})}/></label><label className="span-2">{t('call.objective')}<textarea value={callDraft.callObjective} placeholder={t('call.objectivePlaceholder')} onChange={e=>setCallDraft({...callDraft,callObjective:e.target.value})}/></label><label>{t('call.offerFocus')}<textarea value={callDraft.offerFocus} onChange={e=>setCallDraft({...callDraft,offerFocus:e.target.value})}/></label><label>{t('call.emmaFocus')}<textarea value={client.emmaFocus || ''} readOnly /></label><label className="span-2">{t('call.operatorNote')}<textarea value={callDraft.operatorNote} onChange={e=>setCallDraft({...callDraft,operatorNote:e.target.value})}/></label>{callTask?.readinessIssues?.length ? <p className="span-2 error-text" role="status">{t('call.notReady')}: {callTask.readinessIssues.map(issue=>t(`readiness.${issue}`)).join(', ')}</p> : null}<div className="span-2 form-actions"><Button type="submit" disabled={callTaskBusy}>{callTaskBusy?t('common.saving'):t('call.prepare')}</Button>{callTask?.status==='READY'&&<Button type="button" onClick={callWithEmma}>{t('call.callEmma')}</Button>}</div></form>
      <div className="call-brief"><h4>{t('call.brief')}</h4>{!callBrief ? <p className="muted">{t('call.briefUnavailable')}</p> : <dl><dt>{t('lead.company')}</dt><dd>{callBrief.company}</dd><dt>{t('lead.phone')}</dt><dd>{callBrief.phone||'—'}</dd>{callBrief.currentSituation&&<><dt>{t('lead.currentSituation')}</dt><dd>{callBrief.currentSituation}</dd></>}{callBrief.painPoints&&<><dt>{t('lead.painPoints')}</dt><dd>{callBrief.painPoints}</dd></>}<dt>{t('call.objective')}</dt><dd>{callBrief.callObjective||'—'}</dd>{callBrief.auditProblem&&<><dt>{t('lead.auditProblem')}</dt><dd>{callBrief.auditProblem}</dd></>}{callBrief.proposedSolution&&<><dt>{t('lead.proposedSolution')}</dt><dd>{callBrief.proposedSolution}</dd></>}{callBrief.emmaFocus&&<><dt>{t('lead.emmaFocus')}</dt><dd>{callBrief.emmaFocus}</dd></>}{callBrief.offerFocus&&<><dt>{t('lead.offerFocus')}</dt><dd>{callBrief.offerFocus}</dd></>}{callBrief.doNotMention&&<><dt>{t('lead.doNotMention')}</dt><dd>{callBrief.doNotMention}</dd></>}{callBrief.operatorNote&&<><dt>{t('call.operatorNote')}</dt><dd>{callBrief.operatorNote}</dd></>}</dl>}</div>
    </Section>

    <Section title={t('sections.lastFeedback')} open={!!result}>{!result ? <p className="muted">{t('feedback.empty')}</p> : <dl className="feedback-grid">{feedbackFields.map(([key,label])=>{const value=result[key];if(value===undefined||value===''||(Array.isArray(value)&&!value.length))return null;return <div key={key}><dt>{t(label)}</dt><dd>{Array.isArray(value)?value.join(', '):typeof value==='string'&&(/At$|Start$|End$/.test(key))?new Date(value).toLocaleString(i18n.language):String(value)}</dd></div>})}{result.objections?.length?<div><dt>{t('feedback.objections')}</dt><dd>{result.objections.join(' · ')}</dd></div>:null}{result.doNotContact!==undefined?<div><dt>{t('feedback.doNotContact')}</dt><dd>{result.doNotContact?t('common.yes'):t('common.no')}</dd></div>:null}</dl>}</Section>

    <Section title={t('messages.logContact')}><form onSubmit={addMessage} className="field-grid"><label>{t('messages.channel')}<select value={message.channel} onChange={e=>setMessage({...message,channel:e.target.value as ContactChannel})}>{CONTACT_CHANNELS.map(value=><option key={value} value={value}>{t(contactChannelKeys[value])}</option>)}</select></label><label>{t('messages.direction')}<select value={message.direction} onChange={e=>setMessage({...message,direction:e.target.value as 'in'|'out'})}><option value="out">{t('direction.out')}</option><option value="in">{t('direction.in')}</option></select></label><label className="span-2">{t('messages.summary')}<textarea required value={message.body} onChange={e=>setMessage({...message,body:e.target.value})}/></label><Button type="submit">{t('messages.save')}</Button></form></Section>
    <Section title={t('sections.timeline')} open>{!timeline.length&&<p>{t('timeline.empty')}</p>}<div className="timeline">{timeline.map(item=><div key={item.key}><strong>{item.title}</strong><small>{new Date(item.date).toLocaleString(i18n.language)}</small>{item.detail&&<p>{item.detail}</p>}</div>)}</div></Section>
  </div>;
}
