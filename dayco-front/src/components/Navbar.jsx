import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../api/axios';
import './Navbar.css';

function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [dropdownAbierto, setDropdownAbierto] = useState(false);
    const [productos, setProductos] = useState([]);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        api.get('/productos').then(r => setProductos(r.data)).catch(() => {});
    }, []);

    const esHome = location.pathname === '/';

    const cerrarTodo = () => {
        setMenuAbierto(false);
        setDropdownAbierto(false);
    };

    return (
        <nav className={`navbar ${scrolled || !esHome ? 'navbar--solido' : ''}`}>
          <Link to="/" className="navbar__logo" onClick={cerrarTodo}>
            Dayco Gaming
          </Link>
          <button
            className="navbar__hamburger"
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            ☰
          </button>
          <ul className={`navbar__links ${menuAbierto ? 'navbar__links--abierto' : ''}`}>
            <li><Link to="/" onClick={cerrarTodo}>Inicio</Link></li>

            <li className="navbar__dropdown-wrap">
              <button
                className="navbar__dropdown-btn"
                onClick={() => setDropdownAbierto(!dropdownAbierto)}
                onBlur={() => setTimeout(() => setDropdownAbierto(false), 160)}
              >
                Productos <span className={`navbar__dropdown-arrow ${dropdownAbierto ? 'navbar__dropdown-arrow--open' : ''}`}>▾</span>
              </button>
              {dropdownAbierto && (
                <ul className="navbar__dropdown">
                  {productos.map(p => (
                    <li key={p.id}>
                      <Link to={`/productos/${p.id}`} onClick={cerrarTodo}>
                        {p.titulo}
                      </Link>
                    </li>
                  ))}
                  {productos.length === 0 && (
                    <li className="navbar__dropdown-empty">Cargando...</li>
                  )}
                </ul>
              )}
            </li>

            <li>
              <a href="/#nosotros" onClick={cerrarTodo}>Nosotros</a>
            </li>
            <li>
              <a href="/#contacto" onClick={cerrarTodo}>Contacto</a>
            </li>
          </ul>
        </nav>
    );
}

export default Navbar;
