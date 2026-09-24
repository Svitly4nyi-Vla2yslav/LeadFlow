import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import de from './resources.de.json'; import uk from './resources.uk.json'; import ru from './resources.ru.json';
const resources = { de:{translation:de}, uk:{translation:uk}, ru:{translation:ru} } as const;
const storedLanguage = typeof localStorage === 'undefined' ? null : localStorage.getItem('leadflow.language');
const language = storedLanguage && ['de','uk','ru'].includes(storedLanguage) ? storedLanguage : 'uk';
if (typeof document !== 'undefined') document.documentElement.lang = language;
i18n.use(initReactI18next).init({ resources, lng:language, fallbackLng:'uk', supportedLngs:['de','uk','ru'], interpolation:{escapeValue:false} });
export default i18n;
