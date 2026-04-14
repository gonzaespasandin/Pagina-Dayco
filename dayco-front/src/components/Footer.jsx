import './Footer.css';

function Footer() {
    return (
      <footer className="footer">
        <div className="footer__container">
          <div className="footer__logo">
            <img src="/LogoDaycoGaming.png" alt="Dayco Gaming" width="180" height="60" />
            <p>Soluciones integrales para la industria del entretenimiento</p>
          </div>
          <div className="footer__links">
            <a href="/#inicio">Inicio</a>
            <a href="/#productos">Productos</a>
            <a href="/#nosotros">Nosotros</a>
            <a href="/#contacto">Contacto</a>
            <a href="/admin">Admin</a>
          </div>
        </div>
        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} Dayco Gaming. Todos los derechos reservados.</p>
          <p>Desarrollado por <a href="https://www.linkedin.com/in/espasandin-gonzalo/" target="_blank" rel="noopener noreferrer">Gonzalo Espasandin</a></p>
        </div>
      </footer>
    );
}

export default Footer;
