import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './Login.css';

function Login() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      const res = await api.post('/auth/login', { usuario, password });
      localStorage.setItem('token', res.data.token);
      navigate('/admin');
    } catch {
      setError('Usuario o contraseña incorrectos.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login">
      <div className="login__card">
        <div className="login__header">
          <span className="login__logo">Dayco Gaming</span>
          <p>Panel de Administración</p>
        </div>

        <form className="login__form" onSubmit={handleSubmit}>
          <div className="login__field">
            <label htmlFor="usuario">Usuario</label>
            <input
              id="usuario"
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="admin"
              required
              autoFocus
            />
          </div>

          <div className="login__field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="login__error">{error}</p>}

          <button type="submit" className="login__btn" disabled={cargando}>
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;