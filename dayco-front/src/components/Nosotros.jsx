import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import api from '../api/axios';
import './Nosotros.css';

/**
 * Separa el número y el símbolo de un valor guardado en la BD.
 * Siempre devuelve el símbolo como sufijo para CountUp.
 */
function parsearValorStat(valor) {
  const str = String(valor).trim();
  const match = str.match(/^([+]?)(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return { numero: null, sufijo: str };
  const prefijo = match[1];
  const numero  = parseFloat(match[2]);
  const sufijo  = match[3] || prefijo;
  return { numero, sufijo };
}

function Nosotros() {
    const [stats, setStats] = useState([]);

    const [contadorActivo, setContadorActivo] = useState(false);

    useEffect(() => {
        api.get('/contenido')
            .then(res=>setStats(res.data))
            .catch(err => console.error('[Nosotros] Error al cargar stats:', err));
    }, []);

    return (
        <section id="nosotros" className="nosotros">
          <div className="nosotros__container">
            <motion.div
              className="nosotros__header"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2>Nosotros</h2>
              <div className="divider" />
            </motion.div>

            <div className="nosotros__body">
              <motion.div
                className="nosotros__imagenes"
                initial={{ opacity: 0, x: -80 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <div className="nosotros__img-card">
                  <img src="/dayco-empresa.webp" alt="Dayco en SAGSE 2025" />
                  <span>SAGSE 2025</span>
                </div>
              </motion.div>
              <motion.div
                className="nosotros__texto"
                initial={{ opacity: 0, x: 80 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <p className="nosotros__lead">
                  Más de <span>35 años de experiencia</span> en soluciones integrales
                  para la industria del entretenimiento.
                </p>
                <p>
                  Somos una empresa formada por <span>profesionales en electrónica e informática</span>,
                  pioneros en el desarrollo de ruletas electrónicas y electromecánicas desde 1990.
                </p>
                <p>
                  Contamos con un <span>laboratorio propio</span> donde diseñamos y fabricamos todos
                  nuestros productos. Nuestra <span>ingeniería de diseño, materia prima y desarrollo
                  son 100% nacionales</span>.
                </p>
              </motion.div>
            </div>

            {stats.length > 0 && (
              <motion.div
                className="nosotros__stats"
                onViewportEnter={() => setContadorActivo(true)}
                viewport={{ once: true, amount: 0.3 }}
              >
                {stats.map((stat, index) => {
                  const { numero, sufijo } = parsearValorStat(stat.valor);
                  return (
                    <motion.div
                      key={stat.id}
                      className="stat-item"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <span className="stat-item__valor">
                        {numero === null ? (
                          stat.valor
                        ) : contadorActivo ? (
                          sufijo === '+' ? (
                            <CountUp end={numero} prefix="+" duration={2.2} />
                          ) : sufijo === '%' ? (
                            <CountUp end={numero} suffix="%" duration={2.2} />
                          ) : (
                            <CountUp end={numero} suffix={sufijo} duration={2.2} />
                          )
                        ) : (
                          sufijo === '+' ? `+0` : `0${sufijo}`
                        )}
                      </span>
                      <span className="stat-item__titulo">{stat.titulo}</span>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>
        </section>
    );
}

export default Nosotros;
