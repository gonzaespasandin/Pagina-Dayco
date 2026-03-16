import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ProductForm from '../components/admin/ProductForm';
import StatForm from '../components/admin/StatForm';
import CasinoForm from '../components/admin/CasinoForm';
import './Admin.css';

function Admin() {
  const [tab, setTab] = useState('productos');

  // Productos
  const [productos, setProductos] = useState([]);
  const [formProductoAbierto, setFormProductoAbierto] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);

  // Stats
  const [stats, setStats] = useState([]);
  const [formStatAbierto, setFormStatAbierto] = useState(false);
  const [statEditando, setStatEditando] = useState(null);

  // Casinos
  const [casinos, setCasinos] = useState([]);
  const [formCasinoAbierto, setFormCasinoAbierto] = useState(false);
  const [casinoEditando, setCasinoEditando] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    cargarTodo();
  }, []);

  const cargarTodo = () => {
    cargarProductos();
    cargarStats();
    cargarCasinos();
  };

  const cargarProductos = async () => {
    try {
      const res = await api.get('/productos');
      setProductos(res.data);
    } catch {
      navigate('/login');
    }
  };

  const cargarStats = async () => {
    try {
      const res = await api.get('/contenido');
      setStats(res.data);
    } catch { /* silencioso */ }
  };

  const cargarCasinos = async () => {
    try {
      const res = await api.get('/casinos');
      setCasinos(res.data);
    } catch { /* silencioso */ }
  };

  // --- Handlers Productos ---
  const handleEliminarProducto = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return;
    await api.delete(`/productos/${id}`);
    cargarProductos();
  };

  // --- Handlers Stats ---
  const handleEliminarStat = async (id) => {
    if (!window.confirm('¿Eliminar esta estadística?')) return;
    await api.delete(`/contenido/${id}`);
    cargarStats();
  };

  // --- Handlers Casinos ---
  const handleEliminarCasino = async (id) => {
    if (!window.confirm('¿Eliminar este casino?')) return;
    await api.delete(`/casinos/${id}`);
    cargarCasinos();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="admin">
      <aside className="admin__sidebar">
        <div className="admin__brand">Dayco Gaming</div>
        <nav className="admin__nav">
          {[
            { key: 'productos', label: 'Productos' },
            { key: 'nosotros', label: 'Nosotros' },
            { key: 'casinos', label: 'Casinos' },
          ].map(({ key, label }) => (
            <button
              key={key}
              className={`admin__nav-item ${tab === key ? 'admin__nav-item--active' : ''}`}
              onClick={() => setTab(key)}
            >
              {label}
            </button>
          ))}
        </nav>
        <button className="admin__logout" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </aside>

      <main className="admin__main">

        {/* ─── PRODUCTOS ─── */}
        {tab === 'productos' && (
          <div className="admin__section">
            <div className="admin__section-header">
              <h2>Productos</h2>
              {!formProductoAbierto && (
                <button className="admin__btn-nuevo" onClick={() => { setProductoEditando(null); setFormProductoAbierto(true); }}>
                  + Nuevo producto
                </button>
              )}
            </div>

            {formProductoAbierto ? (
              <ProductForm
                producto={productoEditando}
                onGuardado={() => { setFormProductoAbierto(false); setProductoEditando(null); cargarProductos(); }}
                onCancelar={() => { setFormProductoAbierto(false); setProductoEditando(null); }}
              />
            ) : productos.length === 0 ? (
              <div className="admin__empty">No hay productos. ¡Creá el primero!</div>
            ) : (
              <div className="admin__tabla">
                <div className="admin__tabla-header">
                  <span>Imagen</span>
                  <span>Título</span>
                  <span>Descripción</span>
                  <span>Acciones</span>
                </div>
                {productos.map((p) => (
                  <div key={p.id} className="admin__tabla-fila">
                    <div className="admin__tabla-img">
                      {p.imagen_url
                        ? <img src={`http://localhost:3001${p.imagen_url}`} alt={p.titulo} />
                        : <span className="admin__no-img">Sin imagen</span>
                      }
                    </div>
                    <span className="admin__tabla-titulo">{p.titulo}</span>
                    <span className="admin__tabla-desc">{p.descripcion || '—'}</span>
                    <div className="admin__tabla-acciones">
                      <button className="admin__btn-accion admin__btn-accion--edit" onClick={() => { setProductoEditando(p); setFormProductoAbierto(true); }}>Editar</button>
                      <button className="admin__btn-accion admin__btn-accion--delete" onClick={() => handleEliminarProducto(p.id)}>Eliminar</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── NOSOTROS / STATS ─── */}
        {tab === 'nosotros' && (
          <div className="admin__section">
            <div className="admin__section-header">
              <h2>Estadísticas — Nosotros</h2>
              {!formStatAbierto && (
                <button className="admin__btn-nuevo" onClick={() => { setStatEditando(null); setFormStatAbierto(true); }}>
                  + Nueva estadística
                </button>
              )}
            </div>

            {formStatAbierto ? (
              <StatForm
                stat={statEditando}
                onGuardado={() => { setFormStatAbierto(false); setStatEditando(null); cargarStats(); }}
                onCancelar={() => { setFormStatAbierto(false); setStatEditando(null); }}
              />
            ) : stats.length === 0 ? (
              <div className="admin__empty">No hay estadísticas. ¡Creá la primera!</div>
            ) : (
              <div className="admin__tabla">
                <div className="admin__tabla-header admin__tabla-header--stats">
                  <span>Valor</span>
                  <span>Título</span>
                  <span>Acciones</span>
                </div>
                {stats.map((s) => (
                  <div key={s.id} className="admin__tabla-fila admin__tabla-fila--stats">
                    <span className="admin__tabla-titulo">{s.valor}</span>
                    <span className="admin__tabla-desc">{s.titulo}</span>
                    <div className="admin__tabla-acciones">
                      <button className="admin__btn-accion admin__btn-accion--edit" onClick={() => { setStatEditando(s); setFormStatAbierto(true); }}>Editar</button>
                      <button className="admin__btn-accion admin__btn-accion--delete" onClick={() => handleEliminarStat(s.id)}>Eliminar</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── CASINOS ─── */}
        {tab === 'casinos' && (
          <div className="admin__section">
            <div className="admin__section-header">
              <h2>Casinos</h2>
              {!formCasinoAbierto && (
                <button className="admin__btn-nuevo" onClick={() => { setCasinoEditando(null); setFormCasinoAbierto(true); }}>
                  + Nuevo casino
                </button>
              )}
            </div>

            {formCasinoAbierto ? (
              <CasinoForm
                casino={casinoEditando}
                onGuardado={() => { setFormCasinoAbierto(false); setCasinoEditando(null); cargarCasinos(); }}
                onCancelar={() => { setFormCasinoAbierto(false); setCasinoEditando(null); }}
              />
            ) : casinos.length === 0 ? (
              <div className="admin__empty">No hay casinos. ¡Creá el primero!</div>
            ) : (
              <div className="admin__tabla">
                <div className="admin__tabla-header admin__tabla-header--casinos">
                  <span>Logo</span>
                  <span>Nombre</span>
                  <span>Orden</span>
                  <span>Acciones</span>
                </div>
                {casinos.map((c) => (
                  <div key={c.id} className="admin__tabla-fila admin__tabla-fila--casinos">
                    <div className="admin__tabla-img">
                      {c.logo_url
                        ? <img src={`http://localhost:3001${c.logo_url}`} alt={c.nombre} />
                        : <span className="admin__no-img">Sin logo</span>
                      }
                    </div>
                    <span className="admin__tabla-titulo">{c.nombre}</span>
                    <span className="admin__tabla-desc">{c.orden}</span>
                    <div className="admin__tabla-acciones">
                      <button className="admin__btn-accion admin__btn-accion--edit" onClick={() => { setCasinoEditando(c); setFormCasinoAbierto(true); }}>Editar</button>
                      <button className="admin__btn-accion admin__btn-accion--delete" onClick={() => handleEliminarCasino(c.id)}>Eliminar</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

    </div>
  );
}

export default Admin;
