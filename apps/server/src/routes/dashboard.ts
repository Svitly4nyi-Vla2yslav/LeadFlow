import { Router } from 'express';
import { CRM_STATUSES, CrmStatus, db } from '../db/memory';

const r = Router();
const conversionPairs: Array<[CrmStatus, CrmStatus]> = [
  ['AUDITED', 'CONTACTED'],
  ['CONTACTED', 'REPLY'],
  ['REPLY', 'CALL'],
  ['CALL', 'OFFER'],
  ['OFFER', 'WON']
];

// Маршрут без вхідних параметрів агрегує поточний стан CRM і повертає показники для дашборда.
// Він лише читає in-memory знімок: клієнтів або історію статусів не змінює.
r.get('/', (_req, res) => {
  // Для кожного дозволеного статусу підраховується кількість клієнтів, які перебувають у ньому зараз.
  const counts = Object.fromEntries(CRM_STATUSES.map(status => [status, db.clients.filter(c => c.crmStatus === status).length]));
  // Допоміжна функція приймає статус і повертає кількість клієнтів, які досягали його будь-коли за історією.
  const reached = (status: CrmStatus) => db.clients.filter(c => c.statusHistory?.some(event => event.status === status)).length;
  // Кожна конверсія порівнює клієнтів, що пройшли обидва етапи, з усіма, хто досяг початкового.
  // Якщо знаменник нульовий, rate повертається як null, щоб не маскувати відсутність даних нульовим відсотком.
  const conversions = Object.fromEntries(conversionPairs.map(([from, to]) => {
    const denominator = reached(from);
    const numerator = db.clients.filter(c => c.statusHistory?.some(event => event.status === from) && c.statusHistory?.some(event => event.status === to)).length;
    return [`${from}_TO_${to}`, { numerator, denominator, rate: denominator ? numerator / denominator : null }];
  }));
  // ISO-формат YYYY-MM-DD дозволяє коректно порівнювати збережені календарні дати як рядки.
  const today = new Date().toISOString().slice(0, 10);
  const overdueFollowUps = db.clients.filter(c => c.nextFollowUpDate && c.nextFollowUpDate < today && !['WON', 'LOST'].includes(c.crmStatus)).length;
  // Обидва reduce підсумовують лише відомі суми; відсутнє offerAmount дає нуль.
  const offerPipelineValue = db.clients.filter(c => ['OFFER', 'FOLLOW-UP'].includes(c.crmStatus)).reduce((sum, c) => sum + (c.offerAmount || 0), 0);
  const wonValue = db.clients.filter(c => c.crmStatus === 'WON').reduce((sum, c) => sum + (c.offerAmount || 0), 0);
  res.json({ counts, conversions, total: db.clients.length, overdueFollowUps, offerPipelineValue, wonValue });
});

export default r;
