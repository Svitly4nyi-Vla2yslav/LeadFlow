import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { api } from '../api/client';
import { applyColumnMapping, IMPORT_FIELDS, inferColumnMapping, parseCsv } from '../utils/leadImport';

const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:3001');
type ImportResult = { created: number; skipped: number; errors: Array<{ row: number; error: string }> };
const fieldLabelKeys: Record<typeof IMPORT_FIELDS[number], string> = {
  company:'lead.company', branche:'lead.industry', ort:'lead.location', website:'lead.website', contactPerson:'lead.contactPerson', phone:'lead.phone', email:'lead.email', source:'lead.source',
  preferredLanguage:'lead.preferredLanguage', decisionMaker:'lead.decisionMaker', currentSituation:'lead.currentSituation', painPoints:'lead.painPoints', auditProblem:'lead.auditProblem', proposedSolution:'lead.proposedSolution',
  emmaFocus:'lead.emmaFocus', offerFocus:'lead.offerFocus', doNotMention:'lead.doNotMention', notes:'lead.notes', crmStatus:'lead.status', contactChannel:'lead.contactChannel', lastContactDate:'lead.lastContactDate',
  nextFollowUpDate:'lead.nextFollowUpDate', offerAmount:'lead.offerAmount', lostReason:'lead.lostReason'
};

export default function DataManagement() {
  const { t } = useTranslation();
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const chooseFile = async (file?: File) => {
    if (!file) return;
    try {
      const text = await file.text();
      let parsedRows: Record<string, unknown>[];
      if (file.name.toLowerCase().endsWith('.json')) {
        const parsed = JSON.parse(text);
        parsedRows = Array.isArray(parsed) ? parsed : parsed.leads;
        if (!Array.isArray(parsedRows) || parsedRows.some(row => !row || typeof row !== 'object' || Array.isArray(row))) throw new Error('invalid_json');
      } else parsedRows = parseCsv(text);
      const detected = [...new Set(parsedRows.flatMap(row => Object.keys(row)))];
      setRows(parsedRows); setColumns(detected); setMapping(inferColumnMapping(detected)); setResult(null); setError('');
    } catch (exception: any) {
      setRows([]); setColumns([]); setMapping({});
      setError(exception.message === 'invalid_csv' ? t('import.invalidCsv') : exception.message === 'invalid_json' ? t('import.invalidJson') : t('import.readError'));
    }
  };

  const normalizedRows = applyColumnMapping(rows, mapping);
  const runImport = async () => {
    if (!normalizedRows.length || normalizedRows.length > 1000) { setError(t('import.tooMany')); return; }
    setBusy(true); setError('');
    try { const response = await api.post('/api/clients/import', { leads: normalizedRows }); setResult(response.data); }
    catch { setError(t('import.failed')); }
    finally { setBusy(false); }
  };

  return <div className="page-stack">
    <Card><h1>{t('data.title')}</h1><p className="muted">{t('data.subtitle')}</p><Link className="action-link primary" to="/leads#create-lead">{t('data.addLead')}</Link></Card>
    <Card><h2>{t('import.title')}</h2><p className="muted">{t('import.instructions')}</p><label>{t('import.file')}<input type="file" accept=".json,.csv,application/json,text/csv" onChange={event => chooseFile(event.target.files?.[0])} /></label>
      {!!columns.length && <><h3>{t('import.columnMapping')}</h3><div className="mapping-grid">{columns.map(column => <label key={column}>{column}<select value={mapping[column] || ''} onChange={event => setMapping(current => ({ ...current, [column]: event.target.value }))}><option value="">{t('import.ignore')}</option>{IMPORT_FIELDS.map(field => <option key={field} value={field}>{t(fieldLabelKeys[field])}</option>)}</select></label>)}</div>
        <h3>{t('import.preview')}</h3><div className="import-preview">{normalizedRows.slice(0, 5).map((row, index) => <pre key={index}>{JSON.stringify(row, null, 2)}</pre>)}</div>
        <Button type="button" onClick={runImport} disabled={busy || !normalizedRows.length || normalizedRows.length > 1000}>{busy ? t('common.importing') : t('import.confirm', { count: normalizedRows.length })}</Button></>}
      {result && <div aria-live="polite"><p>{t('import.result', { created: result.created, skipped: result.skipped, errors: result.errors.length })}</p>{!!result.errors.length && <><h3>{t('import.errors')}</h3><ul>{result.errors.map(item => <li key={`${item.row}-${item.error}`}>{t('import.rowError', { row: item.row, error: item.error })}</li>)}</ul></>}</div>}
      {error && <p role="alert" className="error-text">{error}</p>}
    </Card>
    <Card><h2>{t('data.exportTitle')}</h2><p className="muted">{t('data.exportDescription')}</p><Button type="button" onClick={() => { window.location.href = `${apiUrl}/api/export/clients.csv`; }}>{t('data.exportCsv')}</Button></Card>
  </div>;
}
