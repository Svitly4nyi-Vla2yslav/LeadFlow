import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import de from './resources.de.json'; import uk from './resources.uk.json'; import ru from './resources.ru.json';
const resources = { de:{translation:de}, uk:{translation:uk}, ru:{translation:ru} } as const;
i18n.use(initReactI18next).init({ resources, lng:'uk', fallbackLng:'uk', interpolation:{escapeValue:false} });
export default i18n;
