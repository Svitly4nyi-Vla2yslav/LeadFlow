import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const Aside = styled.aside`
  height:100vh;padding:26px 18px;backdrop-filter:blur(22px) saturate(145%);-webkit-backdrop-filter:blur(22px) saturate(145%);position:sticky;top:0;
  background:linear-gradient(180deg,rgba(10,12,15,.9),rgba(7,8,10,.76));
  border-right:1px solid rgba(212,175,55,.12);
  box-shadow:18px 0 60px rgba(0,0,0,.32),inset -1px 0 rgba(255,255,255,.025);
  h3{margin:0 10px 28px;font-family:Inter,Manrope,sans-serif;font-size:24px;font-weight:700;color:${({theme})=>theme.colors.accentStrong};letter-spacing:-.02em}
  h3::after{content:' / CRM';font-family:Inter,sans-serif;font-size:9px;letter-spacing:.14em;color:${({theme})=>theme.colors.subtle}}
  @media(max-width:900px){display:none}
`;
const Nav = styled.nav`display:grid;gap:7px;a{display:flex;align-items:center;min-height:44px;padding:10px 12px;border:1px solid transparent;border-radius:${({theme})=>theme.radii.sm};color:${({theme})=>theme.colors.subtle};transition:background .18s ease,border-color .18s ease,color .18s ease,transform .18s ease}.active{background:linear-gradient(135deg,rgba(212,175,55,.15),rgba(156,122,24,.07));border-color:rgba(212,175,55,.22);color:${({theme})=>theme.colors.accentStrong};box-shadow:inset 0 1px rgba(255,255,255,.035)}a:hover{background:rgba(255,255,255,.035);color:${({theme})=>theme.colors.text};transform:translateX(2px)}`;

export default function Sidebar(){
  const { t } = useTranslation();
  return (
    <Aside>
      <h3>LeadFlow</h3>
      <Nav>
        <NavLink to="/">{t('nav.dashboard')}</NavLink>
        <NavLink to="/clients">{t('nav.clients')}</NavLink>
        <NavLink to="/leads">{t('nav.leads')}</NavLink>
        <NavLink to="/calls">{t('nav.calls')}</NavLink>
        <NavLink to="/data">{t('nav.data')}</NavLink>
        <NavLink to="/maps">{t('nav.maps')}</NavLink>
        <NavLink to="/email">{t('nav.email')}</NavLink>
        <NavLink to="/messages">{t('nav.messages')}</NavLink>
        <NavLink to="/settings">{t('nav.settings')}</NavLink>
      </Nav>
    </Aside>
  );
}
