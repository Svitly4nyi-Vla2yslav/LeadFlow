import { useTranslation } from 'react-i18next';
import Card from '../components/ui/Card';
/**
 * Показує локалізовану заглушку майбутнього редактора листів і нагадування про відписку.
 * Компонент не надсилає та не зберігає повідомлення: його результатом є лише інформаційна картка.
 */
export default function Email(){const{t}=useTranslation();return <Card><h1>{t('email.compose')}</h1><p>{t('email.notImplemented')}</p><p className="muted">{t('gdpr.unsubscribe')}</p></Card>}
