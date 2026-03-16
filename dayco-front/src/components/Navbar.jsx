import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuAbierto, setMenuAbierto] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const esHome = location.pathname === '/';

    return (
        <nav className={`navbar ${scrolled || !esHome ? 'navbar--solido' : ''}`}>
          <Link to="/" className="navbar__logo">
            Dayco Gaming
          </Link>
          <button
            className="navbar__hamburger"
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            ☰
          </button>
          <ul className={`navbar__links ${menuAbierto ? 'navbar__links--abierto' : ''}`}>
            <li><Link to="/" onClick={() => setMenuAbierto(false)}>Inicio</Link></li>
            <li><Link to="/productos" onClick={() => setMenuAbierto(false)}>Productos</Link></li>
            <li>
              <a href="#nosotros" onClick={() => setMenuAbierto(false)}>Nosotros</a>
            </li>
            <li>
              <a href="mailto:contacto@daycogaming.com" onClick={() => setMenuAbierto(false)}>Contacto</a>
            </li>
          </ul>
        </nav>
      );
    }

export default Navbar;
