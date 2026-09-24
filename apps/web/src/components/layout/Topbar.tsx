import styled from 'styled-components'; import LanguageSwitcher from '../LanguageSwitcher'; import { api } from '../../api/client'; import { useTranslation } from 'react-i18next';
const Bar = styled.header`display:flex;align-items:center;justify-content:space-between;padding:16px 24px;border-bottom:1px solid ${({theme})=>theme.colors.border};background:rgba(0,0,0,.25);backdrop-filter:blur(10px);@media(max-width:900px){position:sticky;top:0;z-index:20;padding:8px 12px;padding-top:calc(8px + env(safe-area-inset-top))}@media(max-width:400px){padding-left:8px;padding-right:8px}`;
const Actions = styled.div`display:flex;align-items:center;gap:10px;min-width:0;@media(max-width:400px){gap:6px}`;
const LockButton = styled.button`min-height:44px;border:1px solid rgba(255,255,255,.14);background:transparent;color:rgba(255,255,255,.72);border-radius:9px;padding:8px 10px;cursor:pointer;&:hover{color:#fff;border-color:rgba(255,255,255,.3)}`;
export default function Topbar(){
  const { t } = useTranslation();
  const logout = async () => { try { await api.post('/api/auth/logout'); } finally { window.dispatchEvent(new Event('leadflow:unauthorized')); } };
  return (<Bar><strong>LeadFlow</strong><Actions><LanguageSwitcher/><LockButton type="button" onClick={logout} title={t('auth.lock')}>{t('auth.lock')}</LockButton></Actions></Bar>);
}
