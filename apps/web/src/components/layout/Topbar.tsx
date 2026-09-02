import styled from 'styled-components'; import LanguageSwitcher from '../LanguageSwitcher'; import { api } from '../../api/client';
const Bar = styled.header`display:flex;align-items:center;justify-content:space-between;padding:16px 24px;border-bottom:1px solid ${({theme})=>theme.colors.border};background:rgba(0,0,0,.25);backdrop-filter:blur(10px);`;
const Actions = styled.div`display:flex;align-items:center;gap:10px`;
const LockButton = styled.button`border:1px solid rgba(255,255,255,.14);background:transparent;color:rgba(255,255,255,.72);border-radius:9px;padding:8px 10px;cursor:pointer;&:hover{color:#fff;border-color:rgba(255,255,255,.3)}`;
export default function Topbar(){
  const logout = async () => { try { await api.post('/api/auth/logout'); } finally { window.dispatchEvent(new Event('leadflow:unauthorized')); } };
  return (<Bar><div/><Actions><LanguageSwitcher/><LockButton type="button" onClick={logout} title="CRM sperren">Sperren</LockButton></Actions></Bar>);
}
