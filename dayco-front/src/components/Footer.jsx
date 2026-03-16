import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import './Footer.css';

function Footer() {
    const [productos, setProductos] = useState([]);
    const [dropdownAbierto, setDropdownAbierto] = useState(false);

    useEffect(() => {
        api.get('/productos').then(r => setProductos(r.data)).catch(() => {});
    }, []);

    return (
      <footer className="footer">
        <div className="footer__container">
          <div className="footer__logo">
            <span>Dayco Gaming</span>
            <p>Soluciones integrales para la industria del entretenimiento</p>
          </div>
          <div className="footer__links">
            <Link to="/">Inicio</Link>

            <div className="footer__dropdown-wrap">
              <button
                className="footer__dropdown-btn"
                onClick={() => setDropdownAbierto(!dropdownAbierto)}
              >
                Productos <span className={`footer__dropdown-arrow ${dropdownAbierto ? 'footer__dropdown-arrow--open' : ''}`}>▾</span>
              </button>
              {dropdownAbierto && (
                <ul className="footer__dropdown">
                  {productos.map(p => (
                    <li key={p.id}>
                      <Link to={`/productos/${p.id}`} onClick={() => setDropdownAbierto(false)}>
                        {p.titulo}
                      </Link>
                    </li>
                  ))}
                  {productos.length === 0 && (
                    <li className="footer__dropdown-empty">Cargando...</li>
                  )}
                </ul>
              )}
            </div>

            <a href="/#nosotros">Nosotros</a>
            <a href="/#contacto">Contacto</a>
          </div>
        </div>
        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} Dayco Gaming. Todos los derechos reservados.</p>
        </div>
      </footer>
    );
}

export default Footer;
