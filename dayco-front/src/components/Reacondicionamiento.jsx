import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './Reacondicionamiento.css';

// Las dos imágenes del carrusel "Antes / Después"
const SLIDES = [
  { src: '/antes-plato.webp',   label: 'ANTES',   alt: 'Plato antes del reacondicionamiento' },
  { src: '/despues-plato.webp', label: 'DESPUÉS',  alt: 'Plato después del reacondicionamiento' },
];

// Intervalo de auto-play en milisegundos
const AUTOPLAY_MS = 2500;

export default function Reacondicionamiento() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  // Avanza al siguiente slide; se reinicia el timer con cada interacción manual
  const goTo = (index) => {
    setCurrent(index);
    resetTimer();
  };

  const prev = () => goTo((current - 1 + SLIDES.length) % SLIDES.length);
  const next = () => goTo((current + 1) % SLIDES.length);

  const resetTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % SLIDES.length);
    }, AUTOPLAY_MS);
  };

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <section id="reacondicionamiento" className="reac">
      <div className="reac__container">

        {/* Título de sección */}
        <motion.div
          className="reac__header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-title section-title--light">
            Reacondicionamiento de plato
          </h2>
          <div className="divider" />
        </motion.div>

        {/* Layout dos columnas */}
        <div className="reac__body">

          {/* ── Carrusel Antes / Después ── */}
          <motion.div
            className="reac__carousel-wrap"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <div className="reac__carousel">
              {/* Imagen activa */}
              {SLIDES.map((slide, i) => (
                <div
                  key={slide.label}
                  className={`reac__slide ${i === current ? 'reac__slide--active' : ''}`}
                >
                  <img src={slide.src} alt={slide.alt} />
                  <span className="reac__label">{slide.label}</span>
                </div>
              ))}

              {/* Controles prev / next */}
              <button className="reac__ctrl reac__ctrl--prev" onClick={prev} aria-label="Anterior">
                ‹
              </button>
              <button className="reac__ctrl reac__ctrl--next" onClick={next} aria-label="Siguiente">
                ›
              </button>

              {/* Indicadores */}
              <div className="reac__indicators">
                {SLIDES.map((slide, i) => (
                  <button
                    key={slide.label}
                    className={`reac__dot ${i === current ? 'reac__dot--active' : ''}`}
                    onClick={() => goTo(i)}
                    aria-label={slide.label}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Texto descriptivo ── */}
          <motion.div
            className="reac__text"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            <h3 className="reac__subtitle">
              Puesta a punto integral de cilindros de ruletas electromecánicas
            </h3>
            <p>
              Se realiza la <span className="reac__hl">restauración y/o reemplazo de componentes</span> desde
              la base estructural, incluyendo soportes, pistas y sensores. Además, se lleva a cabo la{' '}
              <span className="reac__hl">limpieza y reacondicionamiento</span> de casilleros, junto con la
              optimización de compuertas, según las necesidades operativas del equipo.
            </p>
            <p>
              Incorporación de <span className="reac__hl">nuevo sistema de iluminación</span> Neon-LED para
              mejorar la <span className="reac__hl">visibilidad y la estética</span> del conjunto.
            </p>
            <p>
              Fabricación y moldeado de nuevas mangueras de disparo, así como la instalación de disparadores
              neumáticos de alta velocidad, optimizando la{' '}
              <span className="reac__hl">respuesta y precisión del sistema</span>.
            </p>
            <p>
              Realización de escaneo 3D de piezas para su posterior{' '}
              <span className="reac__hl">reconstrucción o modificación</span>, permitiendo maximizar el{' '}
              <span className="reac__hl">rendimiento y la eficiencia de funcionamiento</span>.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
