export const IMPORT_FIELDS = [
  'company', 'branche', 'ort', 'website', 'contactPerson', 'phone', 'email', 'source',
  'preferredLanguage', 'decisionMaker', 'currentSituation', 'painPoints', 'auditProblem',
  'proposedSolution', 'emmaFocus', 'offerFocus', 'doNotMention', 'notes', 'crmStatus',
  'contactChannel', 'lastContactDate', 'nextFollowUpDate', 'offerAmount', 'lostReason'
] as const;

const aliases: Record<string, typeof IMPORT_FIELDS[number]> = {
  company: 'company', firma: 'company', unternehmen: 'company', name: 'company',
  branche: 'branche', industry: 'branche', ort: 'ort', city: 'ort', stadt: 'ort',
  website: 'website', url: 'website', contactperson: 'contactPerson', kontaktperson: 'contactPerson',
  phone: 'phone', telefon: 'phone', telephone: 'phone', email: 'email', source: 'source', quelle: 'source',
  preferredlanguage: 'preferredLanguage', language: 'preferredLanguage', sprache: 'preferredLanguage',
  decisionmaker: 'decisionMaker', entscheidungsperson: 'decisionMaker', currentsituation: 'currentSituation',
  aktuellesituation: 'currentSituation', painpoints: 'painPoints', probleme: 'painPoints',
  auditproblem: 'auditProblem', proposedsolution: 'proposedSolution', emmafocus: 'emmaFocus',
  emmafokus: 'emmaFocus', offerfocus: 'offerFocus', angebotsfokus: 'offerFocus',
  donotmention: 'doNotMention', nichterwähnen: 'doNotMention', notes: 'notes', notizen: 'notes',
  crmstatus: 'crmStatus', contactchannel: 'contactChannel', lastcontactdate: 'lastContactDate',
  nextfollowupdate: 'nextFollowUpDate', offeramount: 'offerAmount', lostreason: 'lostReason'
};

const normalizedHeader = (value: string) => value.trim().toLocaleLowerCase().replace(/[\s_./-]+/g, '');

export const inferColumnMapping = (columns: string[]) => Object.fromEntries(
  columns.map(column => [column, aliases[normalizedHeader(column)] || ''])
) as Record<string, string>;

export const applyColumnMapping = (rows: Record<string, unknown>[], mapping: Record<string, string>) => rows.map(row =>
  Object.fromEntries(Object.entries(row).flatMap(([column, value]) => mapping[column] ? [[mapping[column], value]] : []))
);

export const parseCsv = (text: string) => {
  const firstLine = text.split(/\r?\n/, 1)[0] || '';
  const delimiter = (firstLine.match(/;/g) || []).length > (firstLine.match(/,/g) || []).length ? ';' : ',';
  const rows: string[][] = []; let row: string[] = [], cell = '', quoted = false;
  for (let index = 0; index < text.length; index++) {
    const char = text[index];
    if (char === '"' && quoted && text[index + 1] === '"') { cell += '"'; index++; }
    else if (char === '"') quoted = !quoted;
    else if (char === delimiter && !quoted) { row.push(cell.trim()); cell = ''; }
    else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && text[index + 1] === '\n') index++;
      row.push(cell.trim()); cell = ''; if (row.some(Boolean)) rows.push(row); row = [];
    } else cell += char;
  }
  if (quoted) throw new Error('invalid_csv');
  row.push(cell.trim()); if (row.some(Boolean)) rows.push(row);
  const [headers = [], ...values] = rows;
  if (!headers.length || headers.some(header => !header) || values.some(columns => columns.length !== headers.length)) throw new Error('invalid_csv');
  return values.map(columns => Object.fromEntries(headers.map((header, index) => [header, columns[index] || ''])));
};
