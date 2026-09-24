import { useEffect } from 'react';
import { useRoutes, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { routes } from './router';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import MobileNav from './components/layout/MobileNav';
const Shell = styled.div`
  display:grid; grid-template-columns:260px minmax(0,1fr); min-height:100vh;
  @media (max-width: 900px){ grid-template-columns:1fr; padding-bottom:calc(70px + env(safe-area-inset-bottom)); }
`;
const Main = styled.main`padding:24px;max-width:1500px;min-width:0;width:100%;margin:0 auto;@media(max-width:900px){padding:12px 12px 20px}`;
export default function App(){
  const element = useRoutes(routes);
  const loc = useLocation();
  useEffect(()=>{window.scrollTo(0,0)},[loc.pathname]);
  return (<Shell><Sidebar/><div style={{ minWidth: 0 }}><Topbar/><Main>{element}</Main></div><MobileNav/></Shell>);
}
