import { useState, useEffect } from 'react';
import api from '../../api/axios';
import './ProductForm.css';

function StatForm({ stat, onGuardado, onCancelar }) {
  const [titulo, setTitulo] = useState('');
  const [valor, setValor] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (stat) {
      setTitulo(stat.titulo);
      setValor(stat.valor);
    }
  }, [stat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      if (stat) {
        await api.put(`/contenido/${stat.id}`, { titulo, valor });
      } else {
        await api.post('/contenido', { titulo, valor });
      }
      onGuardado();
    } catch (err) {
      console.error('[StatForm] Error al guardar:', err);
      setError(err.response?.data?.error || err.message || 'Error al guardar. Intentá de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="pform">
      <div className="pform__header">
        <h3>{stat ? 'Editar estadística' : 'Nueva estadística'}</h3>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="pform__body">
          <div className="pform__field">
            <label>Valor *</label>
            <input
              type="text"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="Ej: 35+, 100%, 2000+"
              required
            />
          </div>

          <div className="pform__field">
            <label>Título *</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej: Años de experiencia"
              required
            />
          </div>
        </div>

        {error && <p className="pform__error">{error}</p>}

        <div className="pform__actions">
          <button type="button" className="pform__btn pform__btn--cancel" onClick={onCancelar}>
            Cancelar
          </button>
          <button type="submit" className="pform__btn pform__btn--save" disabled={cargando}>
            {cargando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default StatForm;
