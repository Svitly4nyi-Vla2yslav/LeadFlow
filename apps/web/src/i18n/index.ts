import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import de from './resources.de.json'; import uk from './resources.uk.json'; import ru from './resources.ru.json';
// Реєстр перекладів обмежує набір мов, доступних i18next і перемикачу інтерфейсу.
const resources = { de:{translation:de}, uk:{translation:uk}, ru:{translation:ru} } as const;
// Під час серверного виконання localStorage недоступний, тому збережена мова вважається відсутньою.
const storedLanguage = typeof localStorage === 'undefined' ? null : localStorage.getItem('leadflow.language');
// Невідоме або порожнє значення не передається в i18next: базовою мовою залишається українська.
const language = storedLanguage && ['de','uk','ru'].includes(storedLanguage) ? storedLanguage : 'uk';
// Синхронізує атрибут lang для скринридерів і пошукових систем, не звертаючись до DOM на сервері.
if (typeof document !== 'undefined') document.documentElement.lang = language;
// escapeValue вимкнено, бо React самостійно екранує текстові значення під час рендерингу.
i18n.use(initReactI18next).init({ resources, lng:language, fallbackLng:'uk', supportedLngs:['de','uk','ru'], interpolation:{escapeValue:false} });
export default i18n;
