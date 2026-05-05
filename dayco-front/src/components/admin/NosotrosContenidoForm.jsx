import { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import ImageCropperModal from './ImageCropperModal';
import './ProductForm.css';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://127.0.0.1:3000';

function renderizarPreview(texto) {
    if (!texto) return '';
    return texto.replace(/\[\[([^\]]+)\]\]/g, '<span style="color:var(--color-primary);font-weight:600">$1</span>');
}

function NosotrosContenidoForm({ contenido, onGuardado, onCancelar }) {
    const [subtextoFoto, setSubtextoFoto] = useState('');
    const [textoLead, setTextoLead]       = useState('');
    const [textoCuerpo, setTextoCuerpo]   = useState('');
    const [imagen, setImagen]             = useState(null);
    const [preview, setPreview]           = useState(null);
    const [srcCrop, setSrcCrop]           = useState(null);
    const [cargando, setCargando]         = useState(false);
    const [error, setError]               = useState('');

    const leadRef   = useRef(null);
    const cuerpoRef = useRef(null);

    useEffect(() => {
        if (contenido) {
            setSubtextoFoto(contenido.subtexto_foto ?? '');
            setTextoLead(contenido.texto_lead ?? '');
            setTextoCuerpo(contenido.texto_cuerpo ?? '');
            if (contenido.imagen_url) {
                setPreview(`${BASE_URL}${contenido.imagen_url}`);
            }
        }
    }, [contenido]);

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

    // Envuelve el texto seleccionado en [[...]] sin perder la posición del cursor
    const resaltarSeleccion = (valor, setValor, ref) => {
        const el = ref.current;
        if (!el) return;
        const inicio = el.selectionStart;
        const fin    = el.selectionEnd;
        if (inicio === fin) return;
        const seleccion = valor.substring(inicio, fin);
        const nuevo = valor.substring(0, inicio) + '[[' + seleccion + ']]' + valor.substring(fin);
        setValor(nuevo);
        setTimeout(() => {
            el.focus();
            const nuevaPos = inicio + seleccion.length + 4;
            el.setSelectionRange(nuevaPos, nuevaPos);
        }, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!textoLead.trim() || !textoCuerpo.trim()) {
            setError('El párrafo destacado y el cuerpo son obligatorios.');
            return;
        }

        setCargando(true);
        const formData = new FormData();
        formData.append('subtexto_foto', subtextoFoto);
        formData.append('texto_lead',    textoLead);
        formData.append('texto_cuerpo',  textoCuerpo);
        if (imagen) formData.append('imagen', imagen);

        try {
            await api.put('/nosotros', formData);
            onGuardado();
        } catch (err) {
            const msg = err?.response?.data?.error;
            setError(msg ? `Error: ${msg}` : 'Error al guardar. Intentá de nuevo.');
        } finally {
            setCargando(false);
        }
    };

    return (
        <>
            {srcCrop && (
                <ImageCropperModal
                    imageSrc={srcCrop}
                    aspecto={16 / 9}
                    titulo="Recortar imagen de Nosotros"
                    consejo="Tamaño recomendado: 1280 × 720 px o superior. Ratio 16:9."
                    onConfirmar={handleCropConfirmado}
                    onCancelar={() => setSrcCrop(null)}
                />
            )}

            <div className="pform pform--wide">
                <div className="pform__header">
                    <h3>Editar sección Nosotros</h3>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="pform__body">

                        {/* Imagen */}
                        <div className="pform__field">
                            <label>Imagen de la sección (16:9)</label>
                            <div
                                className="pform__upload"
                                style={{ aspectRatio: '16/9' }}
                                onClick={() => document.getElementById('nosotros-img-input').click()}
                            >
                                {preview
                                    ? <img src={preview} alt="preview" className="pform__preview" />
                                    : <span className="pform__upload-placeholder">
                                        <span>+</span> Hacer clic para subir imagen
                                      </span>
                                }
                            </div>
                            <input
                                id="nosotros-img-input"
                                type="file"
                                accept="image/*"
                                onChange={handleImagen}
                                style={{ display: 'none' }}
                            />
                        </div>

                        {/* Subtexto hover */}
                        <div className="pform__field">
                            <label>Subtexto de la foto (hover y alt)</label>
                            <input
                                type="text"
                                value={subtextoFoto}
                                onChange={(e) => setSubtextoFoto(e.target.value)}
                                placeholder="Ej: SAGSE 2025"
                                maxLength={100}
                            />
                        </div>

                        {/* Texto lead */}
                        <div className="pform__field">
                            <label>Párrafo destacado *</label>
                            <p className="pform__section-hint">
                                Seleccioná palabras y presioná el botón para marcarlas con el color primario. Usá <code>[[palabra]]</code> como referencia.
                            </p>
                            <button
                                type="button"
                                className="pform__array-add"
                                style={{ marginBottom: '0.5rem' }}
                                onClick={() => resaltarSeleccion(textoLead, setTextoLead, leadRef)}
                            >
                                Resaltar selección
                            </button>
                            <textarea
                                ref={leadRef}
                                value={textoLead}
                                onChange={(e) => setTextoLead(e.target.value)}
                                rows={3}
                                placeholder="Ej: Más de [[35 años de experiencia]] en soluciones integrales..."
                                required
                            />
                            {textoLead && (
                                <div className="pform__preview-text">
                                    <p className="pform__section-hint" style={{ marginBottom: '0.3rem' }}>Vista previa:</p>
                                    <p
                                        style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--color-text)' }}
                                        dangerouslySetInnerHTML={{ __html: renderizarPreview(textoLead) }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Texto cuerpo */}
                        <div className="pform__field">
                            <label>Párrafos del cuerpo *</label>
                            <p className="pform__section-hint">
                                Separar párrafos con una línea en blanco (Enter × 2). Seleccioná palabras y presioná el botón para resaltarlas.
                            </p>
                            <button
                                type="button"
                                className="pform__array-add"
                                style={{ marginBottom: '0.5rem' }}
                                onClick={() => resaltarSeleccion(textoCuerpo, setTextoCuerpo, cuerpoRef)}
                            >
                                Resaltar selección
                            </button>
                            <textarea
                                ref={cuerpoRef}
                                value={textoCuerpo}
                                onChange={(e) => setTextoCuerpo(e.target.value)}
                                rows={7}
                                placeholder={'Párrafo 1 con [[palabras clave]]...\n\nPárrafo 2 con [[más detalles]]...'}
                                required
                            />
                            {textoCuerpo && (
                                <div className="pform__preview-text">
                                    <p className="pform__section-hint" style={{ marginBottom: '0.3rem' }}>Vista previa:</p>
                                    {textoCuerpo.split('\n\n').map((parrafo, i) => (
                                        <p
                                            key={i}
                                            style={{ fontSize: '0.9rem', lineHeight: 1.7, color: '#64748b', marginBottom: '0.6rem' }}
                                            dangerouslySetInnerHTML={{ __html: renderizarPreview(parrafo) }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>

                    {error && <p className="pform__error">{error}</p>}

                    <div className="pform__actions">
                        <button type="button" className="pform__btn pform__btn--cancel" onClick={onCancelar}>
                            Cancelar
                        </button>
                        <button type="submit" className="pform__btn pform__btn--save" disabled={cargando}>
                            {cargando ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default NosotrosContenidoForm;
