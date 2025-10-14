import { useEffect } from 'react';
import { useRoutes, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { routes } from './router';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
const Shell = styled.div`display:grid;grid-template-columns:260px 1fr;height:100vh;`;
const Main = styled.main`padding:24px;`;
export default function App(){
  const element = useRoutes(routes);
  const loc = useLocation();
  useEffect(()=>{window.scrollTo(0,0)},[loc.pathname]);
  return (<Shell><Sidebar/><div><Topbar/><Main>{element}</Main></div></Shell>);
}
