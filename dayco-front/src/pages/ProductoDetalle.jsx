import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEnvelope, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { ICONOS_DISPONIBLES } from '../components/admin/IconSelector';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ProductoDetalle.css';

// Helper: dado el nombre de un ícono (ej: "faTv"), devuelve el componente FA correspondiente.
// Si no está en la lista, devuelve null.
function Icono({ nombre, className }) {
  const encontrado = ICONOS_DISPONIBLES.find(i => i.nombre === nombre);
  if (!encontrado) return null;
  return <FontAwesomeIcon icon={encontrado.icono} className={className} />;
}

// ── Animaciones reutilizables ────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function ProductoDetalle() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  // Estado para el selector de variantes
  const [varianteActiva, setVarianteActiva] = useState(0);

  // Estado para el lightbox de galería
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    api.get(`/productos/${id}`)
      .then(r => setProducto(r.data))
      .catch(() => setError(true))
      .finally(() => setCargando(false));
  }, [id]);

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
      <div className="pd__loading">Cargando producto...</div>
    </>
  );

  if (error || !producto) return (
    <>
      <Navbar />
      <div className="pd__error">
        <p>No encontramos este producto.</p>
        <Link to="/" className="pd__back-link"><FontAwesomeIcon icon={faArrowLeft} /> Volver al inicio</Link>
      </div>
    </>
  );

  const {
    titulo, subtitulo, descripcion, descripcion_larga,
    imagen_url, features_hero, caracteristicas,
    galeria, especificaciones, variantes, aplicaciones,
  } = producto;

  const imgBase = 'http://localhost:3001';

  return (
    <>
      <Navbar />

      {/* ── 1. Hero ──────────────────────────────────────────────────────────── */}
      <section className="pd__hero">
        <div className="pd__hero-container">
          <motion.div className="pd__hero-text" variants={fadeUp} initial="hidden" animate="visible">
            <Link to="/#productos" className="pd__back-link">
              <FontAwesomeIcon icon={faArrowLeft} /> Volver a productos
            </Link>
            <h1 className="pd__hero-titulo">{titulo}</h1>
            {subtitulo && <p className="pd__hero-subtitulo">{subtitulo}</p>}
            {descripcion && <p className="pd__hero-descripcion">{descripcion}</p>}

            {/* Badges del hero */}
            {features_hero?.length > 0 && (
              <div className="pd__hero-badges">
                {features_hero.map((f, i) => (
                  <span key={i} className="pd__hero-badge">
                    {f.icono && <Icono nombre={f.icono} />}
                    {f.texto}
                  </span>
                ))}
              </div>
            )}

            <a href="/#contacto" className="pd__hero-cta">
              <FontAwesomeIcon icon={faEnvelope} /> Consultar por este producto
            </a>
          </motion.div>

          <motion.div
            className="pd__hero-imagen"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.1 } }}
          >
            {imagen_url
              ? <img src={`${imgBase}${imagen_url}`} alt={titulo} />
              : <div className="pd__hero-imagen-placeholder" />
            }
          </motion.div>
        </div>
      </section>

      {/* ── 2. Descripción larga ─────────────────────────────────────────────── */}
      {descripcion_larga && (
        <section className="pd__descripcion">
          <div className="pd__container">
            <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              {descripcion_larga}
            </motion.p>
          </div>
        </section>
      )}

      {/* ── 3. Características (feature cards) ───────────────────────────────── */}
      {caracteristicas?.length > 0 && (
        <section className="pd__caracteristicas">
          <div className="pd__container">
            <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              Características Principales
            </motion.h2>
            <div className="pd__caracteristicas-grid">
              {caracteristicas.map((c, i) => (
                <motion.div
                  key={i}
                  className="pd__feature-card"
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                >
                  {c.icono && (
                    <div className="pd__feature-card-icon">
                      <Icono nombre={c.icono} />
                    </div>
                  )}
                  <h3>{c.titulo}</h3>
                  <p>{c.descripcion}</p>
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
            <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              Modelos Disponibles
            </motion.h2>
            <div className="pd__variantes-chips">
              {variantes.map((v, i) => (
                <button
                  key={i}
                  className={`pd__variante-chip ${varianteActiva === i ? 'pd__variante-chip--active' : ''}`}
                  onClick={() => setVarianteActiva(i)}
                >
                  {v.nombre}
                </button>
              ))}
            </div>
            <motion.div
              key={varianteActiva}
              className="pd__variante-detalle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <span className="pd__variante-nombre">{variantes[varianteActiva].nombre}</span>
              {variantes[varianteActiva].detalle && (
                <span className="pd__variante-detalle-texto">{variantes[varianteActiva].detalle}</span>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* ── 5. Galería ───────────────────────────────────────────────────────── */}
      {galeria?.length > 0 && (
        <section className="pd__galeria">
          <div className="pd__container">
            <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              Galería
            </motion.h2>
            <div className="pd__galeria-grid">
              {galeria.map((img, i) => (
                <motion.div
                  key={i}
                  className="pd__galeria-item"
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => setLightboxIndex(i)}
                >
                  <img src={`${imgBase}${img.url}`} alt={img.caption || `Imagen ${i + 1}`} />
                  {img.caption && <div className="pd__galeria-caption">{img.caption}</div>}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 6. Especificaciones técnicas ─────────────────────────────────────── */}
      {especificaciones?.length > 0 && (
        <section className="pd__especificaciones">
          <div className="pd__container">
            <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              Especificaciones Técnicas
            </motion.h2>
            <motion.div
              className="pd__specs-tabla"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {especificaciones.map((e, i) => (
                <div key={i} className={`pd__specs-row ${i % 2 === 0 ? 'pd__specs-row--par' : ''}`}>
                  <span className="pd__specs-label">{e.label}</span>
                  <span className="pd__specs-valor">{e.valor}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ── 7. Aplicaciones ──────────────────────────────────────────────────── */}
      {aplicaciones?.length > 0 && (
        <section className="pd__aplicaciones">
          <div className="pd__container">
            <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              Aplicaciones
            </motion.h2>
            <div className="pd__aplicaciones-grid">
              {aplicaciones.map((a, i) => (
                <motion.div
                  key={i}
                  className="pd__aplicacion-item"
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  {a.icono && <Icono nombre={a.icono} className="pd__aplicacion-icon" />}
                  <span>{a.nombre}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 8. CTA final ─────────────────────────────────────────────────────── */}
      <section className="pd__cta">
        <div className="pd__container">
          <motion.div
            className="pd__cta-inner"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2>¿Te interesa este producto?</h2>
            <p>Consultanos sin compromiso, te respondemos a la brevedad.</p>
            <a href="/#contacto" className="pd__cta-btn">
              <FontAwesomeIcon icon={faEnvelope} /> Contactar ahora
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── Lightbox ─────────────────────────────────────────────────────────── */}
      {lightboxIndex !== null && galeria?.length > 0 && (
        <div className="pd__lightbox" onClick={() => setLightboxIndex(null)}>
          <button className="pd__lightbox-nav pd__lightbox-nav--prev" onClick={(e) => { e.stopPropagation(); avanzarLightbox(-1); }}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <div className="pd__lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={`${imgBase}${galeria[lightboxIndex].url}`} alt={galeria[lightboxIndex].caption || ''} />
            {galeria[lightboxIndex].caption && (
              <p className="pd__lightbox-caption">{galeria[lightboxIndex].caption}</p>
            )}
          </div>
          <button className="pd__lightbox-nav pd__lightbox-nav--next" onClick={(e) => { e.stopPropagation(); avanzarLightbox(1); }}>
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
          <button className="pd__lightbox-close" onClick={() => setLightboxIndex(null)}>✕</button>
        </div>
      )}

      <Footer />
    </>
  );
}

export default ProductoDetalle;
