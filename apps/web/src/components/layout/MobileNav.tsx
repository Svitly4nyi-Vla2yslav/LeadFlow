import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const Nav = styled.nav`
  display:none;
  @media(max-width:900px){
    position:sticky;z-index:30;left:0;right:0;bottom:0;display:grid;grid-template-columns:repeat(5,1fr);
    padding:7px 6px calc(7px + env(safe-area-inset-bottom));background:rgba(8,10,14,.96);
    border-top:1px solid ${({ theme }) => theme.colors.border};backdrop-filter:blur(18px);
    a{min-width:0;min-height:48px;display:grid;place-items:center;padding:6px 2px;border-radius:10px;color:rgba(255,255,255,.68);font-size:11px;text-align:center}
    a.active{background:rgba(99,102,241,.24);color:#fff;text-decoration:none}
  }
`;

export default function MobileNav() {
  const { t } = useTranslation();
  return <Nav aria-label={t('nav.mobile')}>
    <NavLink to="/" end>{t('nav.dashboard')}</NavLink>
    <NavLink to="/leads">{t('nav.leads')}</NavLink>
    <NavLink to="/calls">{t('nav.calls')}</NavLink>
    <NavLink to="/messages">{t('nav.messages')}</NavLink>
    <NavLink to="/settings">{t('nav.settings')}</NavLink>
  </Nav>;
}
