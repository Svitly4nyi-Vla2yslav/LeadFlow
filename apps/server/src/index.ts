import app from './app';
import { ENV } from './env';

/**
 * Запускає вже налаштований Express-застосунок на нормалізованому порту з ENV.
 * Побічний ефект модуля — відкриття HTTP-сокета; callback лише підтверджує готовність у журналі.
 */
app.listen(ENV.PORT, () => console.log(`LeadFlow API listening on :${ENV.PORT}`));
