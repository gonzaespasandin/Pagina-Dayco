import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

const Home           = lazy(() => import('./pages/Home'));
const ProductoDetalle = lazy(() => import('./pages/ProductoDetalle'));
const Admin          = lazy(() => import('./pages/Admin'));
const Login          = lazy(() => import('./pages/Login'));
const NotFound       = lazy(() => import('./pages/NotFound'));

function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    const id = hash.slice(1);
    let cancelled = false;
    let debounceTimer;
    let safetyTimeout;

    // Esperar a que la altura del body se estabilice (indica que
    // los datos de la API ya se renderizaron) y recién ahí scrollear
    const resizeObserver = new ResizeObserver(() => {
      if (cancelled) return;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        if (cancelled) return;
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          cleanup();
        }
      }, 300);
    });

    resizeObserver.observe(document.body);

    // Seguridad: si en 10s no se estabilizó, scrollear igual
    safetyTimeout = setTimeout(() => {
      if (cancelled) return;
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      cleanup();
    }, 10000);

    function cleanup() {
      cancelled = true;
      resizeObserver.disconnect();
      clearTimeout(debounceTimer);
      clearTimeout(safetyTimeout);
    }

    return cleanup;
  }, [pathname, hash]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos/:id" element={<ProductoDetalle />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;