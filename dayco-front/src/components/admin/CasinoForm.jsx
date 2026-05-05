import { useState, useEffect } from 'react';
import api from '../../api/axios';
import ImageCropperModal from './ImageCropperModal';
import './ProductForm.css';

function CasinoForm({ casino, onGuardado, onCancelar }) {
  const [nombre, setNombre]     = useState('');
  const [orden, setOrden]       = useState(0);
  const [logo, setLogo]         = useState(null);
  const [preview, setPreview]   = useState(null);
  const [srcCrop, setSrcCrop]   = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError]       = useState('');

  useEffect(() => {
    if (casino) {
      setNombre(casino.nombre);
      setOrden(casino.orden ?? 0);
      setPreview(casino.logo_url ? `${import.meta.env.VITE_BASE_URL || 'http://127.0.0.1:3000'}${casino.logo_url}` : null);
    }
  }, [casino]);

  const handleLogo = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    setSrcCrop(URL.createObjectURL(archivo));
    e.target.value = '';
  };

  const handleCropConfirmado = (archivoRecortado) => {
    setLogo(archivoRecortado);
    setPreview(URL.createObjectURL(archivoRecortado));
    setSrcCrop(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('orden', orden);
    if (logo) formData.append('logo', logo);

    try {
      if (casino) {
        await api.put(`/casinos/${casino.id}`, formData);
      } else {
        await api.post('/casinos', formData);
      }
      onGuardado();
    } catch (err) {
      console.error('[CasinoForm] Error al guardar:', err);
      setError(err.response?.data?.error || err.message || 'Error al guardar. Intentá de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      {/* El crop modal usa position: fixed, aparece sobre todo */}
      {srcCrop && (
        <ImageCropperModal
          imageSrc={srcCrop}
          aspecto={1}
          titulo="Recortar logo del casino"
          consejo="Usá una imagen PNG con fondo transparente para mejor resultado. Tamaño mínimo recomendado: 250 × 250 px."
          onConfirmar={handleCropConfirmado}
          onCancelar={() => setSrcCrop(null)}
        />
      )}

      {/* Form como card inline — sin overlay */}
      <div className="pform">
        <div className="pform__header">
          <h3>{casino ? 'Editar casino' : 'Nuevo casino'}</h3>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="pform__body">
            <div className="pform__field">
              <label>Nombre *</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Casino del Litoral"
                required
              />
            </div>

            <div className="pform__field">
              <label>Orden (menor = primero)</label>
              <input
                type="number"
                value={orden}
                onChange={(e) => setOrden(Number(e.target.value))}
                min={0}
              />
            </div>

            <div className="pform__field">
              <label>Logo</label>
              <div className="pform__upload" onClick={() => document.getElementById('logo-input').click()}>
                {preview
                  ? <img src={preview} alt="preview" className="pform__preview" />
                  : <span className="pform__upload-placeholder">
                      <span>+</span> Hacer clic para subir logo
                    </span>
                }
              </div>
              <input
                id="logo-input"
                type="file"
                accept="image/*"
                onChange={handleLogo}
                style={{ display: 'none' }}
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
    </>
  );
}

export default CasinoForm;
