import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const Nav = styled.nav`
  display:none;
  @media(max-width:900px){
    position:sticky;z-index:30;left:0;right:0;bottom:0;display:grid;grid-template-columns:repeat(5,1fr);
    padding:7px 6px calc(7px + env(safe-area-inset-bottom));background:rgba(7,8,10,.92);
    border-top:1px solid rgba(212,175,55,.14);backdrop-filter:blur(22px) saturate(145%);-webkit-backdrop-filter:blur(22px) saturate(145%);box-shadow:0 -16px 36px rgba(0,0,0,.34);
    a{min-width:0;min-height:48px;display:grid;place-items:center;padding:6px 2px;border:1px solid transparent;border-radius:10px;color:${({theme})=>theme.colors.subtle};font-size:11px;text-align:center}
    a.active{background:${({theme})=>theme.colors.accentSoft};border-color:rgba(212,175,55,.18);color:${({theme})=>theme.colors.accentStrong};text-decoration:none}
  }
`;

export default function MobileNav() {
  const { t } = useTranslation();
  return <Nav aria-label={t('nav.mobile')}>
    <NavLink to="/" end aria-label={t('nav.dashboard')}><span className="nav-label">{t('nav.mobileDashboard')}</span></NavLink>
    <NavLink to="/leads" aria-label={t('nav.leads')}><span className="nav-label">{t('nav.mobileLeads')}</span></NavLink>
    <NavLink to="/calls" aria-label={t('nav.calls')}><span className="nav-label">{t('nav.mobileCalls')}</span></NavLink>
    <NavLink to="/messages" aria-label={t('nav.messages')}><span className="nav-label">{t('nav.mobileMessages')}</span></NavLink>
    <NavLink to="/settings" aria-label={t('nav.settings')}><span className="nav-label">{t('nav.mobileSettings')}</span></NavLink>
  </Nav>;
}
