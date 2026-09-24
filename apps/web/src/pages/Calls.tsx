import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Card from '../components/ui/Card';
import { api } from '../api/client';
import { CallTask, Client } from '../types';

export default function Calls(){
  const { t, i18n } = useTranslation();
  const [tasks,setTasks]=useState<CallTask[]>([]); const [clients,setClients]=useState<Client[]>([]); const [error,setError]=useState('');
  useEffect(()=>{Promise.all([api.get('/api/call-tasks'),api.get('/api/clients')]).then(([calls,leads])=>{setTasks(calls.data);setClients(leads.data)}).catch(()=>setError(t('errors.callsLoad')))},[t]);
  const leads=useMemo(()=>Object.fromEntries(clients.map(client=>[client.id,client])),[clients]);
  return <div className="page-stack"><Card><h1>{t('calls.title')}</h1><p className="muted">{t('calls.subtitle')}</p>{error&&<p role="alert" className="error-text">{error}</p>}</Card><div className="call-task-list">{tasks.map(task=>{const lead=leads[task.leadId];return <Card key={task.id}><div className="lead-card-head"><div><h3>{lead?.company||t('lead.unknown')}</h3><p>{task.scheduledAt?new Date(task.scheduledAt).toLocaleString(i18n.language):t('call.notScheduled')}</p></div><span className="status-pill">{t(`callStatus.${task.status}`)}</span></div><p>{task.callObjective||t('readiness.missing_call_objective')}</p><Link className="action-link primary" to={`/clients/${task.leadId}#emma`}>{task.status==='READY'?t('call.callEmma'):t('actions.open')}</Link></Card>})}{!tasks.length&&!error&&<Card>{t('calls.empty')}</Card>}</div></div>;
}
