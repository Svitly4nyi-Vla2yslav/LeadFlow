import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import ClientDetail from './pages/ClientDetail';
import Messages from './pages/Messages';
import Email from './pages/Email';
import Maps from './pages/Maps';
import Settings from './pages/Settings';
import Login from './pages/Login';

export const routes = [
  { path: '/', element: <Dashboard/> },
  { path: '/clients', element: <Clients/> },
  { path: '/clients/:id', element: <ClientDetail/> },
  { path: '/messages', element: <Messages/> },
  { path: '/email', element: <Email/> },
  { path: '/maps', element: <Maps/> },
  { path: '/settings', element: <Settings/> },
  { path: '/login', element: <Login/> }
];
