import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
    return (
      <footer className="footer">
        <div className="footer__container">
          <div className="footer__logo">
            <span>Dayco Gaming</span>
            <p>Soluciones integrales para la industria del entretenimiento</p>
          </div>
          <div className="footer__links">
            <Link to="/">Inicio</Link>
            <Link to="/productos">Productos</Link>
            <a href="#nosotros">Nosotros</a>
            <a href="mailto:info@dayco.com.ar">Contacto</a>
          </div>
        </div>
        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} Dayco Gaming. Todos los derechos reservados.</p>
        </div>
      </footer>
    );
  }
  export default Footer;