import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './NotFound.css';

function NotFound() {
  return (
    <div className="nf">
      <Navbar />

      {/* Fondo decorativo */}
      <div className="nf__bg">
        <div className="nf__bg-glow nf__bg-glow--1" />
        <div className="nf__bg-glow nf__bg-glow--2" />
        <div className="nf__bg-grid" />
      </div>

      <main className="nf__main">
        {/* Número 404 */}
        <div className="nf__number-wrap">
          <motion.span
            className="nf__number"
            initial={{ opacity: 0, scale: 0.7, filter: 'blur(12px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            404
          </motion.span>

          {/* Línea decorativa detrás del número */}
          <motion.div
            className="nf__number-line"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        {/* Contenido */}
        <motion.div
          className="nf__content"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <h1 className="nf__title">Página no encontrada</h1>
          <p className="nf__description">
            La dirección que ingresaste no existe o fue movida.<br />
            Revisá la URL o volvé al inicio.
          </p>

          <div className="nf__actions">
            <Link to="/" className="nf__btn nf__btn--primary">
              Volver al inicio
            </Link>
            <Link to="/#productos" className="nf__btn nf__btn--ghost">
              Ver productos
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default NotFound;
