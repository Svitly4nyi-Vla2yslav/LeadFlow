import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const Aside = styled.aside`
  height:100vh;padding:26px 18px;backdrop-filter:blur(24px);position:sticky;top:0;
  background:linear-gradient(180deg,rgba(27,25,21,.84),rgba(7,7,6,.78));
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow:18px 0 60px rgba(0,0,0,.22);
  h3{margin:0 10px 28px;font-family:Georgia,serif;font-size:24px;font-weight:500;color:${({theme})=>theme.colors.accentStrong};letter-spacing:-.03em}
  h3::after{content:' / CRM';font-family:Inter,sans-serif;font-size:9px;letter-spacing:.14em;color:${({theme})=>theme.colors.subtle}}
  @media(max-width:900px){display:none}
`;
const Nav = styled.nav`display:grid;gap:7px;a{display:flex;align-items:center;min-height:44px;padding:10px 12px;border:1px solid transparent;border-radius:12px;color:${({theme})=>theme.colors.subtle};transition:.2s ease}.active{background:${({theme})=>theme.colors.accentSoft};border-color:${({theme})=>theme.colors.border};color:${({theme})=>theme.colors.accentStrong}}a:hover{background:rgba(255,255,255,.035);color:#fff}`;

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
