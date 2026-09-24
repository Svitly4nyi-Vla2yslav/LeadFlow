import { useTranslation } from 'react-i18next';
import Card from '../components/ui/Card';
export default function Email(){const{t}=useTranslation();return <Card><h1>{t('email.compose')}</h1><p>{t('email.notImplemented')}</p><p className="muted">{t('gdpr.unsubscribe')}</p></Card>}
