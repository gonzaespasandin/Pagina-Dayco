import { motion } from 'framer-motion';
import './Hero.css';

function Hero() {
    return (
      <section className="hero">
        <div className="hero__video">
          <video autoPlay loop muted playsInline poster="/fallback.png">
            <source src="/videonativa.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="hero__overlay" />
        <div className="hero__content">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Dayco Gaming
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Soluciones integrales para la industria del entretenimiento
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <a href="#productos" className="hero__btn">
              Ver Productos
            </a>
          </motion.div>
        </div>
      </section>
    );
  }
  export default Hero;