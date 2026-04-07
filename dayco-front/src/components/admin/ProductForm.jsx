import { useState, useEffect } from 'react';
import api from '../../api/axios';
import IconSelector from './IconSelector';
import ImageCropperModal from './ImageCropperModal';
import './ProductForm.css';

// ─── Helpers para editar arrays de items ────────────────────────────────────
// actualizarItem: actualiza UN campo de UN item en la posición `index` (inmutable)
const actualizarItem = (setter, index, campo, valor) =>
  setter(prev => prev.map((item, i) => i === index ? { ...item, [campo]: valor } : item));

const eliminarItem = (setter, index) =>
  setter(prev => prev.filter((_, i) => i !== index));

// ─── Componente principal ────────────────────────────────────────────────────
function ProductForm({ producto, onGuardado, onCancelar }) {
  const [tab, setTab] = useState(0);

  // Tab 0: Básico
  const [titulo, setTitulo] = useState('');
  const [subtitulo, setSubtitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [descripcionLarga, setDescripcionLarga] = useState('');
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);
  const [srcCrop, setSrcCrop] = useState(null);

  // Tab 1: Hero y Features
  const [featuresHero, setFeaturesHero] = useState([]);       // [{icono, texto}]
  const [caracteristicas, setCaracteristicas] = useState([]); // [{icono, titulo, descripcion}]

  // Tab 2: Galería
  const [galeria, setGaleria] = useState([]);                 // [{url, caption}]
  const [uploadandoGaleria, setUploadandoGaleria] = useState(false);
  const [reemplazandoIndex, setReemplazandoIndex] = useState(null);
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // Tab 3: Specs
  const [especificaciones, setEspecificaciones] = useState([]); // [{label, valor}]
  const [variantes, setVariantes] = useState([]);               // [{nombre, detalle}]
  const [aplicaciones, setAplicaciones] = useState([]);         // [{icono, nombre}]

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  // Al editar un producto existente, cargamos todos sus campos en el estado local.
  // El backend ya nos devuelve los arrays parseados (no como strings).
  useEffect(() => {
    if (producto) {
      setTitulo(producto.titulo || '');
      setSubtitulo(producto.subtitulo || '');
      setDescripcion(producto.descripcion || '');
      setDescripcionLarga(producto.descripcion_larga || '');
      setPreview(producto.imagen_url ? `http://localhost:3001${producto.imagen_url}` : null);
      setFeaturesHero(Array.isArray(producto.features_hero) ? producto.features_hero : []);
      setCaracteristicas(Array.isArray(producto.caracteristicas) ? producto.caracteristicas : []);
      setGaleria(Array.isArray(producto.galeria) ? producto.galeria : []);
      setEspecificaciones(Array.isArray(producto.especificaciones) ? producto.especificaciones : []);
      setVariantes(Array.isArray(producto.variantes) ? producto.variantes : []);
      setAplicaciones(Array.isArray(producto.aplicaciones) ? producto.aplicaciones : []);
    }
  }, [producto]);

  const handleImagen = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    setSrcCrop(URL.createObjectURL(archivo));
    e.target.value = '';
  };

  const handleCropConfirmado = (archivoRecortado) => {
    setImagen(archivoRecortado);
    setPreview(URL.createObjectURL(archivoRecortado));
    setSrcCrop(null);
  };

  // Sube una imagen de galería al servidor (endpoint dedicado) y agrega la URL al array
  const handleSubirImagenGaleria = async (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    setUploadandoGaleria(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('imagen', archivo);
      const resp = await api.post('/productos/upload-imagen', fd);
      setGaleria(prev => [...prev, { url: resp.data.url, caption: '' }]);
    } catch {
      setError('Error al subir imagen de galería. Intentá de nuevo.');
    } finally {
      setUploadandoGaleria(false);
      e.target.value = '';
    }
  };

  const handleReemplazarImagenGaleria = async (e, index) => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    setReemplazandoIndex(index);
    setError('');
    try {
      const fd = new FormData();
      fd.append('imagen', archivo);
      const resp = await api.post('/productos/upload-imagen', fd);
      setGaleria(prev => prev.map((item, i) => i === index ? { ...item, url: resp.data.url } : item));
    } catch {
      setError('Error al reemplazar imagen. Intentá de nuevo.');
    } finally {
      setReemplazandoIndex(null);
      e.target.value = '';
    }
  };

  const handleDragStart = (i) => setDragIndex(i);
  const handleDragOver = (e, i) => {
    e.preventDefault();
    if (dragOverIndex !== i) setDragOverIndex(i);
  };
  const handleDrop = (i) => {
    if (dragIndex === null || dragIndex === i) return;
    const nueva = [...galeria];
    const [item] = nueva.splice(dragIndex, 1);
    nueva.splice(i, 0, item);
    setGaleria(nueva);
    setDragIndex(null);
    setDragOverIndex(null);
  };
  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    // FormData porque enviamos una imagen (multipart/form-data).
    // Los arrays los serializamos como JSON strings; el backend los guarda como TEXT en SQLite.
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);
    formData.append('subtitulo', subtitulo);
    formData.append('descripcion_larga', descripcionLarga);
    formData.append('features_hero', JSON.stringify(featuresHero));
    formData.append('caracteristicas', JSON.stringify(caracteristicas));
    formData.append('galeria', JSON.stringify(galeria));
    formData.append('especificaciones', JSON.stringify(especificaciones));
    formData.append('variantes', JSON.stringify(variantes));
    formData.append('aplicaciones', JSON.stringify(aplicaciones));
    if (imagen) formData.append('imagen', imagen);

    try {
      if (producto) {
        await api.put(`/productos/${producto.id}`, formData);
      } else {
        await api.post('/productos', formData);
      }
      onGuardado();
    } catch {
      setError('Error al guardar el producto. Intentá de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  const TABS = ['Básico', 'Hero y features', 'Galería', 'Specs y más'];

  return (
    <>
    {srcCrop && (
      <ImageCropperModal
        imageSrc={srcCrop}
        aspectos={[
          { label: '3:4  Vertical',   valor: 3 / 4 },
          { label: '4:3  Horizontal', valor: 4 / 3 },
        ]}
        titulo="Recortar imagen principal"
        consejo="Usá una imagen PNG con fondo transparente para mejor resultado. Tamaño mínimo recomendado: 400 × 400 px."
        onConfirmar={handleCropConfirmado}
        onCancelar={() => setSrcCrop(null)}
      />
    )}
    <div className="pform pform--wide">

      <div className="pform__header">
        <h3>{producto ? 'Editar producto' : 'Nuevo producto'}</h3>
      </div>

        {/* Navegación por tabs */}
        <div className="pform__tabs">
          {TABS.map((nombre, i) => (
            <button
              key={i}
              type="button"
              className={`pform__tab ${tab === i ? 'pform__tab--active' : ''}`}
              onClick={() => setTab(i)}
            >
              {nombre}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="pform__body">

            {/* ── Tab 0: Básico ─────────────────────────────────── */}
            {tab === 0 && (
              <>
                <div className="pform__field">
                  <label>Título *</label>
                  <input
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Ej: Dayco Roulette Nativa III"
                    required
                  />
                </div>

                <div className="pform__field">
                  <label>Subtítulo / Tagline</label>
                  <input
                    type="text"
                    value={subtitulo}
                    onChange={(e) => setSubtitulo(e.target.value)}
                    placeholder="Ej: Ruleta Electromecánica Modular Touch-screen"
                  />
                </div>

                <div className="pform__field">
                  <label>Descripción breve (para la tarjeta en la grilla)</label>
                  <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Descripción corta, 1-2 oraciones..."
                    rows={2}
                  />
                </div>

                <div className="pform__field">
                  <label>Descripción larga (página de detalle)</label>
                  <textarea
                    value={descripcionLarga}
                    onChange={(e) => setDescripcionLarga(e.target.value)}
                    placeholder="Texto completo que aparece en la sección descripción de la página del producto..."
                    rows={5}
                  />
                </div>

                <div className="pform__field">
                  <label>Imagen principal</label>
                  <div className="pform__upload" onClick={() => document.getElementById('img-input').click()}>
                    {preview
                      ? <img src={preview} alt="preview" className="pform__preview" />
                      : <span className="pform__upload-placeholder">
                          <span>+</span> Hacer clic para subir imagen
                        </span>
                    }
                  </div>
                  <input
                    id="img-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImagen}
                    style={{ display: 'none' }}
                  />
                </div>
              </>
            )}

            {/* ── Tab 1: Hero y features ────────────────────────── */}
            {tab === 1 && (
              <>
                <div className="pform__section-title">Badges del hero</div>
                <p className="pform__section-hint">
                  Aparecen como pills debajo del título en el hero. Ej: &quot;21.5″ Zero-Bezel&quot;, &quot;Protocolo SAS 6.02&quot;.
                </p>

                {featuresHero.map((item, i) => (
                  <div key={i} className="pform__array-item">
                    <button type="button" className="pform__array-delete" onClick={() => eliminarItem(setFeaturesHero, i)}>✕</button>
                    <div className="pform__field">
                      <label>Ícono</label>
                      <IconSelector value={item.icono} onChange={(v) => actualizarItem(setFeaturesHero, i, 'icono', v)} />
                    </div>
                    <div className="pform__field">
                      <label>Texto</label>
                      <input
                        type="text"
                        value={item.texto}
                        onChange={(e) => actualizarItem(setFeaturesHero, i, 'texto', e.target.value)}
                        placeholder='Ej: 21.5" Zero-Bezel'
                      />
                    </div>
                  </div>
                ))}

                <button type="button" className="pform__array-add" onClick={() => setFeaturesHero(prev => [...prev, { icono: '', texto: '' }])}>
                  + Agregar badge
                </button>

                <div className="pform__divider" />

                <div className="pform__section-title">Tarjetas de características</div>
                <p className="pform__section-hint">
                  Grilla de cards con ícono grande, título y descripción. Resaltan los puntos fuertes del producto.
                </p>

                {caracteristicas.map((item, i) => (
                  <div key={i} className="pform__array-item">
                    <button type="button" className="pform__array-delete" onClick={() => eliminarItem(setCaracteristicas, i)}>✕</button>
                    <div className="pform__field">
                      <label>Ícono</label>
                      <IconSelector value={item.icono} onChange={(v) => actualizarItem(setCaracteristicas, i, 'icono', v)} />
                    </div>
                    <div className="pform__field">
                      <label>Título</label>
                      <input
                        type="text"
                        value={item.titulo}
                        onChange={(e) => actualizarItem(setCaracteristicas, i, 'titulo', e.target.value)}
                        placeholder="Ej: Pantalla de Alta Resolución"
                      />
                    </div>
                    <div className="pform__field">
                      <label>Descripción</label>
                      <textarea
                        value={item.descripcion}
                        onChange={(e) => actualizarItem(setCaracteristicas, i, 'descripcion', e.target.value)}
                        rows={2}
                        placeholder="Breve descripción de esta característica..."
                      />
                    </div>
                  </div>
                ))}

                <button type="button" className="pform__array-add" onClick={() => setCaracteristicas(prev => [...prev, { icono: '', titulo: '', descripcion: '' }])}>
                  + Agregar característica
                </button>
              </>
            )}

            {/* ── Tab 2: Galería ────────────────────────────────── */}
            {tab === 2 && (
              <>
                <div className="pform__section-title">Galería de imágenes</div>
                <p className="pform__section-hint">
                  Fotos adicionales: distintos ángulos, detalles, en uso real. Podés agregar un caption a cada imagen.
                </p>

                {galeria.map((item, i) => (
                  <div
                    key={i}
                    className={[
                      'pform__array-item pform__array-item--galeria',
                      dragIndex === i ? 'pform__array-item--dragging' : '',
                      dragOverIndex === i && dragIndex !== i ? 'pform__array-item--drag-over' : '',
                    ].join(' ')}
                    draggable
                    onDragStart={() => handleDragStart(i)}
                    onDragOver={(e) => handleDragOver(e, i)}
                    onDrop={() => handleDrop(i)}
                    onDragEnd={handleDragEnd}
                  >
                    <span className="pform__galeria-drag-handle" title="Arrastrar para reordenar">⠿</span>
                    <button type="button" className="pform__array-delete" onClick={() => eliminarItem(setGaleria, i)}>✕</button>
                    <div className="pform__galeria-preview">
                      <img src={`http://localhost:3001${item.url}`} alt={`Galería ${i + 1}`} />
                      <label className="pform__galeria-edit-overlay" title="Cambiar imagen">
                        {reemplazandoIndex === i ? (
                          <span className="pform__galeria-edit-text">Subiendo...</span>
                        ) : (
                          <>
                            <span className="pform__galeria-edit-icon">✏</span>
                            <span className="pform__galeria-edit-text">Cambiar</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleReemplazarImagenGaleria(e, i)}
                          style={{ display: 'none' }}
                          disabled={reemplazandoIndex !== null}
                        />
                      </label>
                    </div>
                    <div className="pform__field">
                      <label>Caption (opcional)</label>
                      <input
                        type="text"
                        value={item.caption}
                        onChange={(e) => actualizarItem(setGaleria, i, 'caption', e.target.value)}
                        placeholder="Ej: Configuración de 16 puestos"
                      />
                    </div>
                  </div>
                ))}

                <label className={`pform__array-add pform__array-add--upload ${uploadandoGaleria ? 'pform__array-add--loading' : ''}`}>
                  {uploadandoGaleria ? 'Subiendo...' : '+ Subir imagen a galería'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSubirImagenGaleria}
                    style={{ display: 'none' }}
                    disabled={uploadandoGaleria}
                  />
                </label>
              </>
            )}

            {/* ── Tab 3: Specs y más ────────────────────────────── */}
            {tab === 3 && (
              <>
                <div className="pform__section-title">Especificaciones técnicas</div>
                <p className="pform__section-hint">
                  Tabla de característica → valor. Ej: &quot;Tamaño de Pantalla&quot; / &quot;21.5″ 1920×1080p&quot;.
                </p>

                {especificaciones.map((item, i) => (
                  <div key={i} className="pform__array-item pform__array-item--row">
                    <div className="pform__field">
                      <label>Característica</label>
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => actualizarItem(setEspecificaciones, i, 'label', e.target.value)}
                        placeholder="Ej: Tamaño de Pantalla"
                      />
                    </div>
                    <div className="pform__field">
                      <label>Valor</label>
                      <input
                        type="text"
                        value={item.valor}
                        onChange={(e) => actualizarItem(setEspecificaciones, i, 'valor', e.target.value)}
                        placeholder='Ej: 21.5" 1920×1080p'
                      />
                    </div>
                    <button type="button" className="pform__array-delete pform__array-delete--row" onClick={() => eliminarItem(setEspecificaciones, i)}>✕</button>
                  </div>
                ))}

                <button type="button" className="pform__array-add" onClick={() => setEspecificaciones(prev => [...prev, { label: '', valor: '' }])}>
                  + Agregar especificación
                </button>

                <div className="pform__divider" />

                <div className="pform__section-title">Variantes / Modelos</div>
                <p className="pform__section-hint">
                  Distintas versiones: tamaños, configuraciones de puestos, etc. Se muestran como chips seleccionables.
                </p>

                {variantes.map((item, i) => (
                  <div key={i} className="pform__array-item pform__array-item--row">
                    <div className="pform__field">
                      <label>Nombre</label>
                      <input
                        type="text"
                        value={item.nombre}
                        onChange={(e) => actualizarItem(setVariantes, i, 'nombre', e.target.value)}
                        placeholder='Ej: 21.5"'
                      />
                    </div>
                    <div className="pform__field">
                      <label>Detalle</label>
                      <input
                        type="text"
                        value={item.detalle}
                        onChange={(e) => actualizarItem(setVariantes, i, 'detalle', e.target.value)}
                        placeholder="Ej: Resolución 1920×1080"
                      />
                    </div>
                    <button type="button" className="pform__array-delete pform__array-delete--row" onClick={() => eliminarItem(setVariantes, i)}>✕</button>
                  </div>
                ))}

                <button type="button" className="pform__array-add" onClick={() => setVariantes(prev => [...prev, { nombre: '', detalle: '' }])}>
                  + Agregar variante
                </button>

                <div className="pform__divider" />

                <div className="pform__section-title">Aplicaciones / Usos</div>
                <p className="pform__section-hint">
                  Ámbitos donde puede usarse el producto. Ej: &quot;Gaming y Casino&quot;, &quot;Automatización Industrial&quot;.
                </p>

                {aplicaciones.map((item, i) => (
                  <div key={i} className="pform__array-item">
                    <button type="button" className="pform__array-delete" onClick={() => eliminarItem(setAplicaciones, i)}>✕</button>
                    <div className="pform__field">
                      <label>Ícono</label>
                      <IconSelector value={item.icono} onChange={(v) => actualizarItem(setAplicaciones, i, 'icono', v)} />
                    </div>
                    <div className="pform__field">
                      <label>Nombre</label>
                      <input
                        type="text"
                        value={item.nombre}
                        onChange={(e) => actualizarItem(setAplicaciones, i, 'nombre', e.target.value)}
                        placeholder="Ej: Gaming y Casino"
                      />
                    </div>
                  </div>
                ))}

                <button type="button" className="pform__array-add" onClick={() => setAplicaciones(prev => [...prev, { icono: '', nombre: '' }])}>
                  + Agregar aplicación
                </button>
              </>
            )}

          </div>

          {error && <p className="pform__error">{error}</p>}

          <div className="pform__actions">
            <button type="button" className="pform__btn pform__btn--cancel" onClick={onCancelar}>
              Cancelar
            </button>
            <button type="submit" className="pform__btn pform__btn--save" disabled={cargando}>
              {cargando ? 'Guardando...' : 'Guardar producto'}
            </button>
          </div>
        </form>
    </div>
    </>
  );
}

export default ProductForm;
