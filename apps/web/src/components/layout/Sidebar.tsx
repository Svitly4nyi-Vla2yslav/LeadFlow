import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const Aside = styled.aside`
  height: 100vh; padding: 20px; backdrop-filter: blur(20px); position:sticky; top:0;
  background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  @media(max-width:760px){height:auto;position:static;padding:12px 14px;border-right:0;border-bottom:1px solid ${({theme})=>theme.colors.border};h3{margin:0 0 10px}}
`;
const Nav = styled.nav` display: grid; gap: 8px; a{padding:6px 8px;border-radius:8px}.active{background:rgba(255,255,255,.1)} @media(max-width:760px){display:flex;overflow-x:auto;white-space:nowrap} `;

export default function Sidebar(){
  const { t } = useTranslation();
  return (
    <Aside>
      <h3>LeadFlow</h3>
      <Nav>
        <NavLink to="/">{t('nav.dashboard')}</NavLink>
        <NavLink to="/clients">{t('nav.clients')}</NavLink>
        <NavLink to="/leads">Leads / CRM</NavLink>
        <NavLink to="/maps">Maps</NavLink>
        <NavLink to="/email">{t('nav.email')}</NavLink>
        <NavLink to="/messages">{t('nav.messages')}</NavLink>
        <NavLink to="/settings">{t('nav.settings')}</NavLink>
      </Nav>
    </Aside>
  );
}
