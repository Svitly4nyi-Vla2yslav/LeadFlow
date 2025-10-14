import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const Aside = styled.aside`
  height: 100vh; padding: 20px; backdrop-filter: blur(20px);
  background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
  border-right: 1px solid ${({ theme }) => theme.colors.border};
`;
const Nav = styled.nav` display: grid; gap: 8px; `;

export default function Sidebar(){
  const { t } = useTranslation();
  return (
    <Aside>
      <h3>LeadFlow</h3>
      <Nav>
        <NavLink to="/">{t('nav.dashboard')}</NavLink>
        <NavLink to="/clients">{t('nav.clients')}</NavLink>
        <NavLink to="/maps">Maps</NavLink>
        <NavLink to="/email">{t('nav.email')}</NavLink>
        <NavLink to="/messages">{t('nav.messages')}</NavLink>
        <NavLink to="/settings">{t('nav.settings')}</NavLink>
      </Nav>
    </Aside>
  );
}
