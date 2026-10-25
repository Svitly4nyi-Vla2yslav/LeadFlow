import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter } from 'react-router-dom';
import { theme } from './styles/theme';
import { GlobalStyle } from './styles/global';
import './i18n';
import App from './App';
import LaunchGate from './components/LaunchGate';
// Точка входу монтує застосунок у #root, підключає тему, глобальні стилі,
// маршрутизацію та LaunchGate. Рендер змінює DOM, а StrictMode допомагає
// виявляти небезпечні побічні ефекти компонентів під час розробки.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <BrowserRouter><LaunchGate><App /></LaunchGate></BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
