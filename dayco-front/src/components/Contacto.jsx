import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons';
import './Contacto.css';

const MAPS_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3282.6248059350532!2d-58.494666823543824!3d-34.63892057294174!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcc9bb1b852499%3A0x98b2a5e2d8fbd0ee!2sDayco%20Gaming%20S.A.!5e0!3m2!1ses!2sar!4v1773841836412!5m2!1ses!2sar';

function Contacto() {
  const [mapaVisible, setMapaVisible] = useState(false);
  const mapaRef = useRef(null);

  // Cargar el iframe solo cuando la sección entra en el viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setMapaVisible(true); },
      { rootMargin: '200px' }
    );
    if (mapaRef.current) observer.observe(mapaRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="contacto" className="contacto">
      <div className="contacto__container">
        <motion.div
          className="contacto__header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>Contacto</h2>
          <div className="divider" />
        </motion.div>

        <div className="contacto__body">
          <motion.div
            className="contacto__info"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="contacto__item">
              <span className="contacto__icono">
                <FontAwesomeIcon icon={faEnvelope} />
              </span>
              <a href="mailto:info@dayco.com.ar">info@dayco.com.ar</a>
            </div>
            <div className="contacto__item">
              <span className="contacto__icono">
                <FontAwesomeIcon icon={faLocationDot} />
              </span>
              <span>Rafaela 4621, Villa Luro, CABA</span>
            </div>
            <div className="contacto__item">
              <span className="contacto__icono">
                <FontAwesomeIcon icon={faPhone} />
              </span>
              <a href="tel:1146715035">11 4671-5035</a>
            </div>
            <a href="mailto:info@dayco.com.ar" className="contacto__btn">
              Envianos un mensaje
            </a>
          </motion.div>

          <motion.div
            ref={mapaRef}
            className="contacto__mapa"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {mapaVisible && (
              <iframe
                title="Ubicación Dayco Gaming"
                src={MAPS_URL}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Contacto;