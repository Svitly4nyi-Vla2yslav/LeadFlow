import styled from 'styled-components'; import LanguageSwitcher from '../LanguageSwitcher'; import { api } from '../../api/client'; import { useTranslation } from 'react-i18next';
const Bar = styled.header`display:flex;align-items:center;justify-content:space-between;padding:15px 24px;border-bottom:1px solid ${({theme})=>theme.colors.border};background:rgba(7,7,6,.72);backdrop-filter:blur(20px);strong{font-family:Georgia,serif;font-size:19px;font-weight:500;color:${({theme})=>theme.colors.accentStrong}}@media(max-width:900px){position:sticky;top:0;z-index:20;padding:8px 12px;padding-top:calc(8px + env(safe-area-inset-top))}@media(max-width:400px){padding-left:8px;padding-right:8px}`;
const Actions = styled.div`display:flex;align-items:center;gap:10px;min-width:0;@media(max-width:400px){gap:6px}`;
const LockButton = styled.button`min-height:44px;border:1px solid ${({theme})=>theme.colors.border};background:rgba(255,255,255,.025);color:${({theme})=>theme.colors.subtle};border-radius:11px;padding:8px 11px;cursor:pointer;&:hover{color:${({theme})=>theme.colors.accentStrong};border-color:rgba(226,190,108,.4)}`;
export default function Topbar(){
  const { t } = useTranslation();
  const logout = async () => { try { await api.post('/api/auth/logout'); } finally { window.dispatchEvent(new Event('leadflow:unauthorized')); } };
  return (<Bar><strong>LeadFlow</strong><Actions><LanguageSwitcher/><LockButton type="button" onClick={logout} title={t('auth.lock')}>{t('auth.lock')}</LockButton></Actions></Bar>);
}
