import { useEffect, useState } from 'react';
import Card from '../components/ui/Card';
import { api } from '../api/client';
import { useTranslation } from 'react-i18next';

type Conversion = { numerator: number; denominator: number; rate: number | null };
type DashboardData = { total: number; counts: Record<string, number>; conversions: Record<string, Conversion>; overdueFollowUps: number; offerPipelineValue: number; wonValue: number };
const visibleStatuses = ['NEW', 'AUDITED', 'CONTACTED', 'REPLY', 'CALL', 'OFFER', 'FOLLOW-UP', 'WON', 'LOST'];
const conversionKeys = ['AUDITED_TO_CONTACTED','CONTACTED_TO_REPLY','REPLY_TO_CALL','CALL_TO_OFFER','OFFER_TO_WON'];

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState('');
  useEffect(() => { api.get('/api/dashboard').then(r => setData(r.data)).catch(() => setError(t('errors.dashboardLoad'))); }, [t]);
  if (error) return <Card><p role="alert">{error}</p></Card>;
  if (!data) return <Card>{t('common.loading')}</Card>;
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Card><h1>{t('dashboard.title')}</h1><div className="metric-row"><span><small>{t('dashboard.totalLeads')}</small><strong>{data.total}</strong></span><span><small>{t('dashboard.overdue')}</small><strong>{data.overdueFollowUps}</strong></span><span><small>{t('dashboard.pipelineValue')}</small><strong>{data.offerPipelineValue.toLocaleString(i18n.language)} €</strong></span><span><small>{t('dashboard.wonValue')}</small><strong>{data.wonValue.toLocaleString(i18n.language)} €</strong></span></div></Card>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))' }}>
        {visibleStatuses.map(status => <Card key={status}><small>{t(`status.${status}`)}</small><h2 style={{ marginBottom: 0 }}>{data.counts[status] || 0}</h2></Card>)}
      </div>
      <Card>
        <h3>{t('dashboard.conversion')}</h3>
        <table className="data-table">
          <tbody>{conversionKeys.map(key => {
            const value = data.conversions[key];
            return <tr key={key} style={{ borderTop: '1px solid rgba(255,255,255,.12)' }}><td>{t(`conversion.${key}`)}</td><td>{value.numerator}/{value.denominator}</td><td>{value.rate === null ? '—' : `${(value.rate * 100).toFixed(1)}%`}</td></tr>;
          })}</tbody>
        </table>
        <p className="muted">{t('dashboard.conversionNote')}</p>
      </Card>
    </div>
  );
}
