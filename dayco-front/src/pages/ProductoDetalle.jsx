import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEnvelope, faChevronLeft, faChevronRight, faXmark } from '@fortawesome/free-solid-svg-icons';
import * as fas from '@fortawesome/free-solid-svg-icons';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ProductoDetalle.css';

// Helper: dado el nombre de un ícono (ej: "faTv"), devuelve el componente FA correspondiente.
function Icono({ nombre, className }) {
  if (!nombre) return null;
  const iconDef = fas[nombre];
  if (!iconDef || !Array.isArray(iconDef.icon)) return null;
  return <FontAwesomeIcon icon={iconDef} className={className} />;
}

// ── Animaciones reutilizables ────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    api.get(`/productos/${id}`)
      .then(r => setProducto(r.data))
      .catch(() => navigate('/404', { replace: true }))
      .finally(() => setCargando(false));
  }, [id]);

  useEffect(() => {
    api.get('/contenido')
      .then(r => setStats(r.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (producto?.titulo) {
      document.title = `Dayco Gaming | ${producto.titulo}`;
    }
    return () => {
      document.title = 'Dayco Gaming';
    };
  }, [producto?.titulo]);

  // Navegación del lightbox con teclado
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e) => {
      if (e.key === 'ArrowRight') avanzarLightbox(1);
      if (e.key === 'ArrowLeft') avanzarLightbox(-1);
      if (e.key === 'Escape') setLightboxIndex(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxIndex, producto]);

  const avanzarLightbox = (dir) => {
    if (!producto?.galeria?.length) return;
    setLightboxIndex(i => (i + dir + producto.galeria.length) % producto.galeria.length);
  };

  if (cargando) return (
    <>
      <Navbar />
      <div className="pd__loading">
        <div className="pd__loading-spinner" />
        <span>Cargando producto...</span>
      </div>
    </>
  );

  if (!cargando && !producto) {
    navigate('/404', { replace: true });
    return null;
  }

  const {
    titulo, subtitulo, descripcion, descripcion_larga,
    imagen_url, features_hero, caracteristicas,
    galeria, especificaciones, variantes, aplicaciones,
  } = producto;

  const imgBase = import.meta.env.VITE_BASE_URL || 'http://127.0.0.1:3000';

  return (
    <>
      <Navbar />

      {/* ── 1. Hero ──────────────────────────────────────────────────────────── */}
      <section className="pd__hero">
        {/* Gradiente decorativo derecho (reemplaza los orbs invisibles) */}
        <div className="pd__hero-bg-accent" aria-hidden="true" />

        {/* Botón volver — fuera del grid para que en mobile aparezca siempre arriba */}
        <div className="pd__container">
          <Link to="/#productos" className="pd__back-link">
            <FontAwesomeIcon icon={faArrowLeft} /> Volver a productos
          </Link>
        </div>

        <div className="pd__hero-container">
          {/* Columna de texto */}
          <motion.div
            className="pd__hero-text"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="pd__hero-text-content">
              {subtitulo && <p className="pd__hero-subtitulo">{subtitulo}</p>}
              <h1 className="pd__hero-titulo">{titulo}</h1>
              {descripcion && <p className="pd__hero-descripcion">{descripcion}</p>}

              {/* Badges del hero */}
              {features_hero?.length > 0 && (
                <motion.div
                  className="pd__hero-badges"
                  variants={stagger}
                  initial="hidden"
                  animate="visible"
                >
                  {features_hero.map((f, i) => (
                    <motion.span key={i} className="pd__hero-badge" variants={fadeUp}>
                      {f.icono && <Icono nombre={f.icono} />}
                      {f.texto}
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </div>

            <a href="/#contacto" className="pd__hero-cta">
              <FontAwesomeIcon icon={faEnvelope} />
              <span>Consultar este producto</span>
              <div className="pd__shimmer" aria-hidden="true" />
            </a>
          </motion.div>

          {/* Columna de imagen — con animación de flotación perpetua */}
          <motion.div
            className="pd__hero-imagen-wrap"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Sombra difusa debajo de la imagen */}
            <div className="pd__hero-shadow" aria-hidden="true" />

            <div className="pd__hero-imagen">
              {imagen_url
                ? <img src={`${imgBase}${imagen_url}`} alt={titulo} />
                : <div className="pd__hero-imagen-placeholder" />
              }
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Marquee strip — rompe la monotonía del scroll ───────────────────── */}
      {/* Marquee: usa las stats de /contenido (mismas que edita el admin en "Nosotros") */}
      {stats.length > 0 && (() => {
        // Armamos cada ítem como "valor titulo" (ej: "35+ Años de experiencia")
        const items = stats.map(s => `${s.valor} ${s.titulo}`);
        // 4 copias para que el loop sea infinito sin cortes (animamos -50%)
        return (
          <div className="pd__marquee-strip" aria-hidden="true">
            <div className="pd__marquee-track">
              {[...items, ...items, ...items, ...items].map((item, i) => (
                <span key={i} className="pd__marquee-item">
                  <span className="pd__marquee-dot" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        );
      })()}

      {/* ── 2. Descripción larga ─────────────────────────────────────────────── */}
      {descripcion_larga && (
        <section className="pd__descripcion">
          <div className="pd__container">
            <motion.div
              className="pd__descripcion-inner"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
            >
              <div className="pd__descripcion-accent" aria-hidden="true" />
              <blockquote className="pd__descripcion-texto">
                {descripcion_larga}
              </blockquote>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── 3. Características — Bento Grid ──────────────────────────────────── */}
      {caracteristicas?.length > 0 && (
        <section className="pd__caracteristicas">
          <div className="pd__container">
            <motion.div
              className="pd__section-header"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
            >
              <span className="pd__section-label">Tecnología</span>
              <h2>Características Principales</h2>
            </motion.div>

            <div className="pd__bento-grid">
              {caracteristicas.map((c, i) => (
                <motion.div
                  key={`${id}-${i}`}
                  className="pd__bento-card"
                  initial={{ opacity: 0, y: 36 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: i * 0.09 }}
                >
                  <div className="pd__bento-card-glow" aria-hidden="true" />
                  <span className="pd__bento-num" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {c.icono && (
                    <div className="pd__bento-icon-wrap">
                      <div className="pd__bento-icon-halo" aria-hidden="true" />
                      <div className="pd__bento-icon">
                        <Icono nombre={c.icono} />
                      </div>
                    </div>
                  )}
                  <h3 className="pd__bento-title">{c.titulo}</h3>
                  <p className="pd__bento-desc">{c.descripcion}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 4. Variantes / Modelos ───────────────────────────────────────────── */}
      {variantes?.length > 0 && (
        <section className="pd__variantes">
          <div className="pd__container">
            <motion.div
              className="pd__section-header"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <span className="pd__section-label">Configuración</span>
              <h2>Modelos Disponibles</h2>
            </motion.div>

            <div className="pd__variantes-grid">
              {variantes.map((v, i) => (
                <motion.div
                  key={i}
                  className="pd__variante-card"
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="pd__variante-card-inner">
                    <span className="pd__variante-numero" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="pd__variante-divider" aria-hidden="true" />
                    <div className="pd__variante-content">
                      <span className="pd__variante-nombre">{v.nombre}</span>
                      {v.detalle && <p className="pd__variante-detalle-texto">{v.detalle}</p>}
                    </div>
                    
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 5. Galería — scroll horizontal ───────────────────────────────────── */}
      {galeria?.length > 0 && (
        <section className="pd__galeria">
          <div className="pd__container">
            <motion.div
              className="pd__section-header"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <span className="pd__section-label">Imágenes</span>
              <h2>Galería</h2>
            </motion.div>
          </div>

          <div className="pd__container">
            {(() => {
              const n = galeria.length;
              const gridClass = n === 1 ? 'pd__galeria-grid--1'
                : n === 2 ? 'pd__galeria-grid--2'
                : n === 3 ? 'pd__galeria-grid--3'
                : n === 4 ? 'pd__galeria-grid--4'
                : 'pd__galeria-grid--many';
              // featured solo cuando el layout lo aprovecha (no en 2 ni en 4)
              const usaFeatured = n === 3 || n >= 5;
              return (
            <div className={`pd__galeria-grid ${gridClass}`}>
              {galeria.map((img, i) => (
                <motion.div
                  key={i}
                  className={`pd__galeria-item${i === 0 && usaFeatured ? ' pd__galeria-item--featured' : ''}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ delay: i * 0.06, duration: 0.5 }}
                  onClick={() => setLightboxIndex(i)}
                  whileHover={{ y: -8 }}
                >
                  <img src={`${imgBase}${img.url}`} alt={img.caption || `Imagen ${i + 1}`} />
                  <div className="pd__galeria-overlay">
                    {img.caption && <span className="pd__galeria-caption">{img.caption}</span>}
                    <span className="pd__galeria-zoom-icon">↗</span>
                  </div>
                </motion.div>
              ))}
            </div>
              );
            })()}
          </div>
        </section>
      )}

      {/* ── 6. Especificaciones técnicas ─────────────────────────────────────── */}
      {especificaciones?.length > 0 && (
        <section className="pd__especificaciones">
          <div className="pd__container">
            <motion.div
              className="pd__section-header"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <span className="pd__section-label">Técnico</span>
              <h2>Especificaciones</h2>
            </motion.div>

            <motion.div
              className="pd__specs-tabla"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {especificaciones.map((e, i) => (
                <motion.div key={i} className="pd__specs-row" variants={fadeUp}>
                  <div className="pd__specs-row-bar" aria-hidden="true" />
                  <span className="pd__specs-label">{e.label}</span>
                  <span className="pd__specs-valor">{e.valor}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ── 7. Aplicaciones ──────────────────────────────────────────────────── */}
      {aplicaciones?.length > 0 && (
        <section className="pd__aplicaciones">
          <div className="pd__container">
            <motion.div
              className="pd__section-header"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <span className="pd__section-label">Usos</span>
              <h2>Aplicaciones</h2>
            </motion.div>

            <motion.div
              className="pd__aplicaciones-grid"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {aplicaciones.map((a, i) => (
                <motion.div
                  key={i}
                  className="pd__aplicacion-card"
                  variants={fadeUp}
                  whileHover={{ y: -5, scale: 1.03 }}
                >
                  <div className="pd__aplicacion-icon-wrap">
                    {a.icono && <Icono nombre={a.icono} className="pd__aplicacion-icon" />}
                  </div>
                  <span className="pd__aplicacion-nombre">{a.nombre}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ── 8. CTA final ─────────────────────────────────────────────────────── */}
      <section className="pd__cta">
        <div className="pd__cta-orb" aria-hidden="true" />
        <div className="pd__container">
          <motion.div
            className="pd__cta-inner"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <span className="pd__section-label pd__section-label--ghost">Contacto</span>
            <h2>¿Te interesa este producto?</h2>
            <p>Consultanos sin compromiso, te respondemos a la brevedad.</p>
            <a href="/#contacto" className="pd__cta-btn">
              <FontAwesomeIcon icon={faEnvelope} />
              Contactar ahora
              <div className="pd__shimmer" aria-hidden="true" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── Lightbox ─────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxIndex !== null && galeria?.length > 0 && (
          <motion.div
            className="pd__lightbox"
            onClick={() => setLightboxIndex(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              className="pd__lightbox-nav pd__lightbox-nav--prev"
              onClick={(e) => { e.stopPropagation(); avanzarLightbox(-1); }}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>

            <motion.div
              className="pd__lightbox-content"
              onClick={(e) => e.stopPropagation()}
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
            >
              <img
                src={`${imgBase}${galeria[lightboxIndex].url}`}
                alt={galeria[lightboxIndex].caption || ''}
              />
              {galeria[lightboxIndex].caption && (
                <p className="pd__lightbox-caption">{galeria[lightboxIndex].caption}</p>
              )}
            </motion.div>

            <button
              className="pd__lightbox-nav pd__lightbox-nav--next"
              onClick={(e) => { e.stopPropagation(); avanzarLightbox(1); }}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>

            <button className="pd__lightbox-close" onClick={() => setLightboxIndex(null)}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}

export default ProductoDetalle;
