# LeadFlow для VS Web Studio: поточний стан і план завершення

## Результат

LeadFlow приведено до одного CRM-стандарту з дев’ятьма статусами: `NEW`, `AUDITED`, `CONTACTED`, `REPLY`, `CALL`, `OFFER`, `FOLLOW-UP`, `WON`, `LOST`. У локальний додаток перенесено 100 реальних записів із `Leadliste_100`. Усі вони залишені `NEW`, оскільки наявні відкриті дані підтверджують існування компаній, але не доводять завершений mini-audit або реальний outbound-контакт.

Додаток уже придатний як локальний операційний CRM для однієї людини. Додано приховану launch-заставку та просту серверну авторизацію власника. Для публічної багатокористувацької production-системи ще потрібні managed identity provider, серверна база даних, резервні копії, розширений захист API, інтеграції зв’язку та узгоджена політика персональних даних.

## Єдиний CRM-стандарт

1. `NEW` — компанію знайдено й додано, але повний mini-audit ще не підтверджено.
2. `AUDITED` — перевірено website, Google/Maps, contact data, Impressum, mobile UX, basic SEO та CTA/contact flow; записано хоча б один конкретний підтверджений audit point.
3. `CONTACTED` — здійснено реальний outbound через email, contact form, LinkedIn, WhatsApp або phone/cold call; є дата, канал і короткий зміст.
4. `REPLY` — отримано змістовну людську відповідь. Автоматичне повідомлення не рахується.
5. `CALL` — про розмову домовлено або її вже проведено; є дата, результат, потреба клієнта й next action.
6. `OFFER` — відправлено конкретну пропозицію зі scope, package, price і delivery time; зафіксовано суму.
7. `FOLLOW-UP` — очікується рішення після контакту, дзвінка або Angebot; є last contact, причина й next follow-up date.
8. `WON` — клієнт погодив роботу; записано послугу, суму, дату й наступний етап.
9. `LOST` — продаж закрито без угоди; обов’язково вибрано затверджену причину.

Кожен lead має рівно один поточний статус. Історія переходів зберігається окремо, тому dashboard може рахувати фактичне проходження етапів. Система не підвищує статус через припущення.

## Обов’язкові поля

Використовуються однакові 17 полів у LeadFlow, Google Sheet та CSV:

- Lead ID
- Company
- Branche
- Ort
- Website
- Contact Person
- Phone
- Email
- CRM Status
- Audit Problem
- Proposed Solution
- Contact Channel
- Last Contact Date
- Next Follow-up Date
- Offer Amount
- Lost Reason
- Notes

Невідоме значення не вигадується: поле залишається порожнім або містить `nicht verifiziert`.

## Що вже працює

### Дані й CRM-логіка

- 100 записів із канонічного `Leadliste_100` доступні локально в LeadFlow.
- Дані зберігаються після перезапуску сервера в атомарно записуваному JSON-сховищі.
- Приватний файл даних виключено з Git і не потрапляє у публічний репозиторій.
- Є захист від дублювання за Company і Website.
- API підтримує створення, перегляд, редагування, видалення з явним підтвердженням і пакетний JSON-імпорт канонічних полів.
- Валідація не дозволяє встановити статус без обов’язкового факту: наприклад, `AUDITED` без Audit Problem або `OFFER` без позитивної суми й деталей.
- Валідуються email, дати, канал контакту, сума Angebot і Lost Reason.
- Кожна зміна статусу додається в незмінюваний журнал подій зі snapshot ключових деталей.
- Контактний журнал підтримує inbound/outbound і п’ять затверджених каналів.

### Інтерфейс

- Dashboard показує кількість лідів за основними статусами й фактичні конверсії `Audited → Contacted`, `Contacted → Reply`, `Reply → Call`, `Call → Offer`, `Offer → Won`.
- Dashboard додатково показує прострочені follow-up, вартість відкритих пропозицій і суму WON.
- Список лідів має пошук за компанією, містом, галуззю та контактними даними, фільтр за статусом і фільтр прострочених follow-up.
- Новий lead створюється мінімально як `NEW` без вигаданих фактів.
- Картка ліда показує всі CRM-поля, керований статус, форму контакту й об’єднаний timeline статусів та повідомлень.
- Сторінка «Клієнти» показує тільки лідів зі статусом `WON`.
- Сторінка «Контактний журнал» показує всі задокументовані inbound/outbound-події.
- Є CSV-експорт із тими самими 17 назвами колонок.
- Інтерфейс адаптовано для вузьких екранів.
- Неавторизований відвідувач бачить тільки великий countdown до 01.01.2027 та оригінальний золотий знак VS Web Studio.
- Прихований gesture відкриває форму, але доступ надається лише після серверної перевірки пароля; сесія зберігається в HttpOnly cookie.

### Інтеграції та якість

- Google Places search/import працює після додавання `GOOGLE_API_KEY`; імпортовані компанії завжди починають із `NEW`.
- Є health endpoint, обмеження JSON payload і вимкнено зайвий Express fingerprint header.
- Додано unit та API integration tests для критичних CRM-правил.
- Команда `npm run check` запускає тести й production build обох застосунків.
- GitHub Actions запускає ту саму перевірку на push і pull request.

## Google Sheets

У фінансовому плані вже є:

- оновлений `Leadliste_100` із 17 CRM-полями;
- `CRM_Dashboard` із кількістю лідів і конверсіями;
- `CRM_Standard` із визначеннями та доказами для кожного статусу;
- `CRM_History` для фактичних подій;
- data validation для CRM Status, Contact Channel і Lost Reason.

Стан після міграції: 100 `NEW`, інші статуси — 0. Це навмисно правильний результат, а не прогалина міграції.

## Що ще потребує уваги

### Блокери перед реальним production-використанням

1. **Розширена авторизація й права доступу.** Простий owner-password, HttpOnly session, logout і rate limit уже працюють. Для кількох користувачів потрібні managed login, відновлення доступу, 2FA та ролі Owner/Viewer.
2. **Production database.** JSON надійний для локальної одноосібної роботи, але не для паралельних користувачів або кількох серверних інстансів. Потрібен PostgreSQL із міграціями, транзакціями й індексами.
3. **Source of truth і синхронізація.** Зараз Google Sheet і LeadFlow не синхронізуються автоматично. Треба затвердити головне джерело. Рекомендація: LeadFlow/PostgreSQL — master, Google Sheet — контрольний export/report.
4. **Резервні копії та відновлення.** Потрібні щоденні encrypted backups, retention і перевірений restore-процес.
5. **Захист API.** Потрібні authentication middleware, rate limiting, security headers, CSRF-політика, журнал входів і production CORS allowlist.
6. **Datenschutz/GDPR.** Потрібно визначити правову підставу обробки B2B lead data, строки зберігання, процес видалення/експорту, список processor-ів та доступ до даних.
7. **Deployment.** Потрібні обрані hosting, domain/API subdomain, HTTPS, secrets, staging і production environment.

### Функціональні модулі другого пріоритету

- автоматичні reminder-и для прострочених follow-up;
- email-відправлення через обраний SMTP/OAuth provider із записом фактичної delivery-події;
- WhatsApp Business інтеграція лише за наявності офіційного акаунта/API;
- структурований mini-audit checklist із доказом/URL/screenshot для кожного пункту;
- attachment-и для audit screenshot, Angebot і consent/brief;
- генерація Angebot із package, scope, price, delivery time і version history;
- Google Sheet import/scheduled export із conflict handling;
- bulk actions без автоматичного підвищення CRM-статусу;
- календар або agenda для follow-up і calls;
- UI-переклад усіх нових рядків однією мовною системою.

### Якість і доведення до «ідеалу»

- browser E2E tests для повного шляху `NEW → WON/LOST`;
- accessibility audit: keyboard navigation, focus, contrast, screen-reader labels;
- centralized error handling, structured logs, uptime/error monitoring;
- optimistic concurrency, audit log користувачів і захист від одночасного перезапису;
- performance test на 10 000+ leads;
- дизайн-система для форм, modal, badges, empty/loading/error states;
- документований incident/restore runbook.

## Рекомендований фронт робіт

### Етап 1 — Production foundation

Тривалість: орієнтовно 3–5 робочих днів після отримання доступів і рішень.

- підключити PostgreSQL та виконати міграцію 100 записів;
- реалізувати authentication/authorization;
- додати security middleware, rate limit і secrets management;
- налаштувати staging, production, HTTPS, monitoring і backups;
- затвердити LeadFlow як master data source;
- критерій готовності: авторизований власник може безпечно працювати з лідами з різних пристроїв, а дані відновлюються з backup.

### Етап 2 — Операційний sales workflow

Тривалість: орієнтовно 4–7 робочих днів.

- mini-audit checklist і evidence attachments;
- follow-up agenda та reminder-и;
- email integration і журнал delivery/reply;
- Angebot builder і зберігання версій;
- Google Sheets scheduled export/import;
- критерій готовності: за 5 секунд видно lead, підтверджений факт, останню дію й next action; жоден статус не виникає без доказу.

### Етап 3 — Якість, UX і запуск

Тривалість: орієнтовно 3–5 робочих днів.

- E2E, accessibility, responsive QA і performance QA;
- повна локалізація;
- error monitoring, логування й operational runbook;
- приймальний тест на копії реальних даних;
- критерій готовності: CI зелений, критичні потоки пройдено, staging схвалено, rollback/restore перевірено.

Загальна оцінка після надання доступів: приблизно 10–17 робочих днів для безпечної production-версії. Інтеграція WhatsApp або складна двостороння синхронізація може збільшити строк.

## Приклад реального ліда

`Olaf Sander HLS` є реальним записом у `Leadliste_100`. Публічно знайдено website, phone та email, але детальний mini-audit не підтверджено, тому його фактичний поточний статус — `NEW`.

Його майбутній шлях без вигадування даних:

1. Перевірити website, Maps, Impressum, mobile UX, SEO та CTA. Лише після запису конкретного факту, наприклад точного дефекту на певній сторінці/viewport, встановити `AUDITED`.
2. Після реально відправленого персоналізованого email записати дату, канал і зміст та встановити `CONTACTED`.
3. Після змістовної людської відповіді — `REPLY`.
4. Після погодження або проведення розмови з результатом, потребою й next action — `CALL`.
5. Після відправлення пропозиції зі scope, package, amount і delivery time — `OFFER`.
6. Під час очікування рішення з наступною датою — `FOLLOW-UP`.
7. Після погодження — `WON`; після підтвердженої відмови або завершених follow-up — `LOST` із затвердженою причиною.

Це приклад правил проходження, а не твердження, що ці події вже відбулися.

## Що потрібно від власника для повного завершення

1. Рішення, де розміщується production: рекомендовано Vercel/Netlify для frontend і Render/Railway/Fly.io для API/PostgreSQL або один узгоджений provider.
2. Домен або API subdomain і доступ до DNS.
3. Вибір авторизації: рекомендовано email magic link або Google OAuth; потрібен список дозволених користувачів.
4. Рішення про source of truth: рекомендовано LeadFlow/PostgreSQL як master, Google Sheet як export/report.
5. Доступ/credentials для Google Drive/Sheets service account або OAuth application, якщо потрібна автоматична синхронізація.
6. SMTP/OAuth provider і verified sender domain для email; окремо — WhatsApp Business account, якщо цей канал автоматизується.
7. Обраний backup target і retention, наприклад щодня 30 днів + щомісячно 12 місяців.
8. Правила Datenschutz: строк зберігання lost leads, хто має доступ, коли видаляти записи, чи зберігати screenshot-и сайтів і листування.
9. Підтвердження мов інтерфейсу та пріоритетної мови за замовчуванням.
10. Рішення, чи GitHub-зміни після review можна merge у `main` і автоматично deploy у production.

Секрети, паролі, API keys і приватні lead data не потрібно надсилати в чат або комітити в Git. Їх слід додавати тільки в secure environment variables обраного hosting provider.
