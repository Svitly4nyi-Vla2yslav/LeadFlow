import { useTranslation } from 'react-i18next'; import Card from '../components/ui/Card'; import LanguageSwitcher from '../components/LanguageSwitcher'; /**
 * Показує локалізовану сторінку налаштувань і делегує вибір мови LanguageSwitcher.
 * Власного стану та запитів не має; наслідки зміни локалі належать дочірньому компоненту.
 */
export default function Settings(){const{t}=useTranslation();return <Card><h1>{t('settings.title')}</h1><p className="muted">{t('settings.subtitle')}</p><label>{t('language.select')}<LanguageSwitcher/></label></Card>}
