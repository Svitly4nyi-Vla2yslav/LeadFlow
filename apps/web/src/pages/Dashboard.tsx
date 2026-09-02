import { useEffect, useState } from 'react';
import Card from '../components/ui/Card';
import { api } from '../api/client';

type Conversion = { numerator: number; denominator: number; rate: number | null };
type DashboardData = { total: number; counts: Record<string, number>; conversions: Record<string, Conversion>; overdueFollowUps: number; offerPipelineValue: number; wonValue: number };
const visibleStatuses = ['NEW', 'AUDITED', 'CONTACTED', 'REPLY', 'CALL', 'OFFER', 'WON', 'LOST'];
const conversionLabels: Record<string, string> = {
  AUDITED_TO_CONTACTED: 'Audited → Contacted', CONTACTED_TO_REPLY: 'Contacted → Reply',
  REPLY_TO_CALL: 'Reply → Call', CALL_TO_OFFER: 'Call → Offer', OFFER_TO_WON: 'Offer → Won'
};

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState('');
  useEffect(() => { api.get('/api/dashboard').then(r => setData(r.data)).catch(() => setError('Dashboard-API nicht erreichbar.')); }, []);
  if (error) return <Card><p role="alert">{error}</p></Card>;
  if (!data) return <Card>Dashboard wird geladen…</Card>;
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Card><h2 style={{ marginTop: 0 }}>CRM-Überblick</h2><div className="metric-row"><span><small>Leads gesamt</small><strong>{data.total}</strong></span><span><small>Follow-ups überfällig</small><strong>{data.overdueFollowUps}</strong></span><span><small>Offene Angebote</small><strong>{data.offerPipelineValue.toLocaleString('de-DE')} €</strong></span><span><small>Gewonnener Wert</small><strong>{data.wonValue.toLocaleString('de-DE')} €</strong></span></div></Card>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))' }}>
        {visibleStatuses.map(status => <Card key={status}><small>{status === 'REPLY' ? 'Replies' : status[0] + status.slice(1).toLowerCase()}</small><h2 style={{ marginBottom: 0 }}>{data.counts[status] || 0}</h2></Card>)}
      </div>
      <Card>
        <h3>Pipeline conversion</h3>
        <table className="data-table">
          <tbody>{Object.entries(conversionLabels).map(([key, label]) => {
            const value = data.conversions[key];
            return <tr key={key} style={{ borderTop: '1px solid rgba(255,255,255,.12)' }}><td>{label}</td><td>{value.numerator}/{value.denominator}</td><td>{value.rate === null ? '—' : `${(value.rate * 100).toFixed(1)}%`}</td></tr>;
          })}</tbody>
        </table>
        <p style={{ opacity: .65 }}>Conversions use recorded status history, not assumptions from the current status.</p>
      </Card>
    </div>
  );
}
