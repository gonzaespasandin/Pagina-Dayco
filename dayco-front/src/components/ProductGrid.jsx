import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { usePageLoad } from '../context/PageLoadContext';
import './ProductGrid.css';

function ProductGrid() {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const { markReady } = usePageLoad();

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const respuesta = await api.get('/productos');
                setProductos(respuesta.data);
            } catch (error) {
                setError('No se pudieron cargar los productos.');
            } finally {
                setCargando(false);
                markReady();
            }
        };

        fetchProductos();
    }, []);

    if (cargando) return <div className="grid__estado">Cargando productos...</div>;
    if (error) return <div className="grid__estado grid__estado--error">{error}</div>;
    if (productos.length === 0) return <div className="grid__estado">No hay productos disponibles.</div>;
    
    return (
      <section id='productos' className="product-grid">
        <div className="product-grid__header">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Nuestros Productos
          </motion.h2>
          <motion.div
            className="divider"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />
        </div>
        <div className="product-grid__items">
          {productos.map((producto, index) => (
            <motion.div
              key={producto.id}
              className="product-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="product-card__imagen">
                <img
                  src={producto.imagen_url
                    ? `${import.meta.env.VITE_BASE_URL || 'http://127.0.0.1:3000'}${producto.imagen_url}`
                    : '/fallback.png'}
                  alt={producto.titulo}
                  width="400"
                  height="400"
                />
              </div>
              <div className="product-card__contenido">
                <h3>{producto.titulo}</h3>
                <p>{producto.descripcion}</p>
                <Link to={`/productos/${producto.id}`} className="product-card__btn">
                  Ver más
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    );
  }
  export default ProductGrid;