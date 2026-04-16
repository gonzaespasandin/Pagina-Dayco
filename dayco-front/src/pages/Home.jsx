import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import Reacondicionamiento from '../components/Reacondicionamiento';
import Nosotros from '../components/Nosotros';
import Casinos from '../components/Casinos';
import Contacto from '../components/Contacto';
import Footer from '../components/Footer';
import { PageLoadProvider, usePageReady } from '../context/PageLoadContext';

function ScrollToHashOnReady() {
  const { hash } = useLocation();
  const pageReady = usePageReady();
  const hasScrolled = useRef(false);

  // Resetear si cambia el hash
  useEffect(() => { hasScrolled.current = false; }, [hash]);

  useEffect(() => {
    if (!hash || !pageReady || hasScrolled.current) return;
    const raf = requestAnimationFrame(() => {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        hasScrolled.current = true;
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [hash, pageReady]);

  return null;
}

function Home() {
  return (
    <PageLoadProvider>
      <ScrollToHashOnReady />
      <Navbar />
      <Hero />
      <ProductGrid />
      <Reacondicionamiento />
      <Nosotros />
      <Casinos />
      <Contacto />
      <Footer />
    </PageLoadProvider>
  );
}
export default Home;