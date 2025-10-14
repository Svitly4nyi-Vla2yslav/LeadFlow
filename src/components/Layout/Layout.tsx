import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

export const Layout: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Очищаем sessionStorage при каждом перезагрузке, но оставляем localStorage для кэша видео
    const clearOnReload = () => {
      sessionStorage.clear();
      // Не очищаем localStorage чтобы сохранить кэшированное видео
    };

    window.addEventListener("beforeunload", clearOnReload);

    return () => {
      window.removeEventListener("beforeunload", clearOnReload);
    };
  }, []);

  // Очистка устаревшего кэша (например, при обновлении видео)
  useEffect(() => {
    const clearOldCache = () => {
      const cacheKeys = Object.keys(localStorage);
      const oldVideoCache = cacheKeys.find(key => key.startsWith('cached_video_'));
      
      if (oldVideoCache) {
        localStorage.removeItem(oldVideoCache);
      }
    };

    clearOldCache();
  }, []);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);

      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 400);
      }
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'auto',
      });
    }
  }, [location.pathname]);

  return (
    <>
      <Header />
      <Suspense>
        <Outlet />
      </Suspense>
      <Footer />
    </>
  );
};