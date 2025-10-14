import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import Home from './pages/HomePage/HomePage';
import AboutUs from './pages/AboutUs/AboutUs';
import Contact from './pages/Contact/Contact';
import Info from './pages/Info/Info';
import { useEffect } from 'react';
import Service from './pages/ServicePages/Service';
import ArticleDetail from './components/NewsTips/NewsSection';
import Refrigeration from './pages/Refrigeration/Refrigeration';
import { AnimatePresence } from 'framer-motion';
import Dryer from './pages/Dryer/Dryer';
import CookieConsentBanner from './components/CookieConsentBanner';
import OvenRepair from './pages/OvenRepair/OvenRepair';
import { trackPageView, trackContactPhone, trackLead } from './components/metaPixel';


declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div style={{ width: '100%', position: 'relative' }}>{children}</div>;
};

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'auto' });
    });
  }, [pathname]);

  return null;
};

export const App: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Страховка для Consent Mode у SPA
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || function() { window.dataLayer.push(arguments as any); };

      window.gtag('consent', 'default', {
        ad_storage: 'denied',
        analytics_storage: 'denied',
        personalization_storage: 'denied',
        functionality_storage: 'denied',
        security_storage: 'granted',
        wait_for_update: 500
      });

      const savedSettings = localStorage.getItem('cookieSettings');
      const consent = localStorage.getItem('cookieConsent');

      if (savedSettings) {
        const s = JSON.parse(savedSettings);
        window.gtag('consent', 'update', {
          ad_storage: s?.advertising?.enabled ? 'granted' : 'denied',
          analytics_storage: s?.analytics?.enabled ? 'granted' : 'denied',
          personalization_storage: s?.functional?.enabled ? 'granted' : 'denied',
          functionality_storage: s?.functional?.enabled ? 'granted' : 'denied',
          security_storage: 'granted'
        });
      } else if (consent === 'granted') {
        window.gtag('consent', 'update', {
          ad_storage: 'granted',
          analytics_storage: 'granted',
          personalization_storage: 'granted',
          functionality_storage: 'granted',
          security_storage: 'granted'
        });
      }
    }
  }, []);

  // PageView на кожну зміну маршруту (антидубль усередині lib)
  useEffect(() => {
    trackPageView();
  }, [location.pathname, location.search]);

  // Після зміни згоди — відправимо актуальний PageView
  useEffect(() => {
    const onConsentChanged = async () => {
      await trackPageView();
    };
    window.addEventListener('cookie-consent-changed', onConsentChanged as EventListener);
    return () => window.removeEventListener('cookie-consent-changed', onConsentChanged as EventListener);
  }, []);

  // Клік по tel: → Contact (антидубль усередині lib)
  useEffect(() => {
    const onClick = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const a = target.closest('a[href^="tel:"]') as HTMLAnchorElement | null;
      if (a) trackContactPhone();
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  // Submit форм із класом contact-form → Lead (антидубль усередині lib + локальний guard)
  useEffect(() => {
    const onSubmit = (e: Event) => {
      const f = e.target as HTMLFormElement;
      if (f && f.matches('form.contact-form')) {
        if (!(f as any).__leadTracked) {
          (f as any).__leadTracked = true;
          trackLead();
          setTimeout(() => { (f as any).__leadTracked = false; }, 5000);
        }
      }
    };
    document.addEventListener('submit', onSubmit, true);
    return () => document.removeEventListener('submit', onSubmit, true);
  }, []);

  return (
    <> 
      <AnimatePresence mode='wait'>
        <Routes location={location} key={location.pathname}>
          <Route path='/' element={<Navigate to='/home' />} />
          <Route path='/' element={<Layout />}>
            <Route
              index
              element={
                <PageWrapper>
                  <Home />
                </PageWrapper>
              }
            />
            <Route
              path='/home'
              element={
                <PageWrapper>
                  <Home />
                </PageWrapper>
              }
            />
            <Route
              path='/service'
              element={
                <PageWrapper>
                  <Service />
                </PageWrapper>
              }
            />
            <Route
              path='/about'
              element={
                <PageWrapper>
                  <AboutUs />
                </PageWrapper>
              }
            />
            <Route path='/tips'>
              <Route
                index
                element={
                  <PageWrapper>
                    <Info />
                  </PageWrapper>
                }
              />
              <Route
                path='refrigerator-maintenance'
                element={
                  <PageWrapper>
                    <ArticleDetail articleId={1} />
                  </PageWrapper>
                }
              />
              <Route
                path='oven-repair-signs'
                element={
                  <PageWrapper>
                    <ArticleDetail articleId={2} />
                  </PageWrapper>
                }
              />
              <Route
                path='laundry-appliance-maintenance'
                element={
                  <PageWrapper>
                    <ArticleDetail articleId={3} />
                  </PageWrapper>
                }
              />
              <Route
                path='dishwasher-drainage'
                element={
                  <PageWrapper>
                    <ArticleDetail articleId={4} />
                  </PageWrapper>
                }
              />
              <Route
                path='repair-vs-replace'
                element={
                  <PageWrapper>
                    <ArticleDetail articleId={5} />
                  </PageWrapper>
                }
              />
              <Route
                path='oem-parts'
                element={
                  <PageWrapper>
                    <ArticleDetail articleId={6} />
                  </PageWrapper>
                }
              />
            </Route>
            <Route
              path='/contact'
              element={
                <PageWrapper>
                  <Contact />
                </PageWrapper>
              }
            />
            <Route
              path='/fridge'
              element={
                <PageWrapper>
                  <Refrigeration />
                </PageWrapper>
              }
            />
            <Route
              path='/dryer'
              element={
                <PageWrapper>
                  <Dryer />
                </PageWrapper>
              }
            />
            <Route
              path='/oven-repair'
              element={
                <PageWrapper>
                  <OvenRepair />
                </PageWrapper>
              }
            />
            <Route
              path='*'
              element={
                <PageWrapper>
                  <Home />
                </PageWrapper>
              }
            />
          </Route>
        </Routes>
        
        {/* Cookie Consent Banner */}
        <CookieConsentBanner />
        
      </AnimatePresence>
    </>
  );
};
