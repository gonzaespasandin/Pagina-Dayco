import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import './Casinos.css';

function Casinos() {
    const [casinos, setCasinos] = useState([]);

    useEffect(() => {
        api.get('/casinos')
        .then(res=>setCasinos(res.data))
        .catch(()=>{});
    }, []);

    if (casinos.length === 0) return null;

    return (
        <section className="casinos">
          <div className="casinos__container">
            <motion.div
              className="casinos__header"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2>Casinos que confían en nosotros</h2>
              <div className="divider" />
            </motion.div>
            <div className="casinos__track-wrapper">
              <div className="casinos__track">
                {[...casinos, ...casinos].map((casino, index) => (
                  <div key={index} className="casinos__item">
                    {casino.logo_url ? (
                      <img
                        src={`http://localhost:3001${casino.logo_url}`}
                        alt={casino.nombre}
                      />
                    ) : (
                      <span className="casinos__nombre">{casino.nombre}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      );
    }
    export default Casinos;