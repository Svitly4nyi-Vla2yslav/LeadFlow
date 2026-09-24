import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const Aside = styled.aside`
  height: 100vh; padding: 20px; backdrop-filter: blur(20px); position:sticky; top:0;
  background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  @media(max-width:900px){display:none}
`;
const Nav = styled.nav` display:grid;gap:8px;a{display:flex;align-items:center;min-height:44px;padding:9px 10px;border-radius:9px}.active{background:rgba(255,255,255,.1)} `;

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
