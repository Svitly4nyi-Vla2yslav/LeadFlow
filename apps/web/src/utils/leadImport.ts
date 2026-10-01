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

/**
 * Нормалізує заголовок CSV: прибирає зовнішні пробіли, переводить у нижній регістр
 * і видаляє типові роздільники, щоб зіставляти різні варіанти назв колонок.
 */
const normalizedHeader = (value: string) => value.trim().toLocaleLowerCase().replace(/[\s_./-]+/g, '');

/**
 * Для кожної вхідної колонки добирає відоме поле CRM або порожній рядок,
 * якщо псевдонім не розпізнано. Ключі результату зберігають оригінальні заголовки.
 */
export const inferColumnMapping = (columns: string[]) => Object.fromEntries(
  columns.map(column => [column, aliases[normalizedHeader(column)] || ''])
) as Record<string, string>;

/**
 * Переносить значення рядків у поля CRM за переданою мапою.
 * Колонки без цільового поля відкидаються; вхідні масиви й об'єкти не змінюються.
 */
export const applyColumnMapping = (rows: Record<string, unknown>[], mapping: Record<string, string>) => rows.map(row =>
  Object.fromEntries(Object.entries(row).flatMap(([column, value]) => mapping[column] ? [[mapping[column], value]] : []))
);

/**
 * Розбирає CSV із комою або крапкою з комою, підтримує лапки, екрановані лапки
 * та переноси рядків усередині quoted-комірок. Повертає масив об'єктів за заголовками.
 * Некоректні лапки, порожні заголовки чи різна кількість колонок дають `invalid_csv`.
 */
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
