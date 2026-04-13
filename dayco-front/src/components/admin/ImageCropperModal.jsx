import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import './ImageCropperModal.css';

/**
 * Toma la imagen original y las coordenadas del recorte (pixelCrop),
 * dibuja en un Canvas y devuelve un File listo para subir al backend.
 */
export async function cropearImagen(imageSrc, pixelCrop, fileName = 'imagen-recortada.png') {
  const imagen = await new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', reject);
    img.src = imageSrc;
  });

  const canvas = document.createElement('canvas');
  canvas.width  = pixelCrop.width;
  canvas.height = pixelCrop.height;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(
    imagen,
    pixelCrop.x, pixelCrop.y,
    pixelCrop.width, pixelCrop.height,
    0, 0,
    pixelCrop.width, pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) { reject(new Error('Canvas vacío')); return; }
      resolve(new File([blob], fileName, { type: 'image/png' }));
    }, 'image/png');
  });
}

/**
 * Modal de recorte reutilizable.
 *
 * Props:
 *   imageSrc    {string}    URL de objeto de la imagen a recortar
 *   aspecto     {number}    Ratio único. Ej: 1 = cuadrado  (usar esto O aspectos, no ambos)
 *   aspectos    {Array}     Array de { label: string, valor: number } para mostrar toggles
 *                           Ej: [{ label: '3:4', valor: 3/4 }, { label: '4:3', valor: 4/3 }]
 *   onConfirmar {function}  Recibe el File recortado
 *   onCancelar  {function}  Se llama al cerrar sin confirmar
 *   titulo      {string}    Texto del encabezado (opcional)
 *   consejo     {string}    Texto de tip (opcional)
 */
function ImageCropperModal({ imageSrc, aspecto, aspectos, onConfirmar, onCancelar, titulo, consejo }) {
  // Si se pasan múltiples ratios, el primero es el seleccionado por defecto
  const tieneMultiples = Array.isArray(aspectos) && aspectos.length > 1;
  const [aspectoActivo, setAspectoActivo] = useState(
    tieneMultiples ? aspectos[0].valor : (aspecto ?? 1)
  );

  const [crop, setCrop]           = useState({ x: 0, y: 0 });
  const [zoom, setZoom]           = useState(1);
  const [pixelCrop, setPixelCrop] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const onCropComplete = useCallback((_areaPercent, areaPixels) => {
    setPixelCrop(areaPixels);
  }, []);

  // Al cambiar el ratio reseteamos el crop para evitar coordenadas fuera de rango
  const handleCambiarAspecto = (valor) => {
    setAspectoActivo(valor);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setPixelCrop(null);
  };

  const handleConfirmar = async () => {
    if (!pixelCrop) return;
    setGuardando(true);
    try {
      const archivo = await cropearImagen(imageSrc, pixelCrop);
      onConfirmar(archivo);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="crop-overlay" onClick={onCancelar}>
      <div className="crop-modal" onClick={(e) => e.stopPropagation()}>

        <div className="crop-modal__header">
          <h3>{titulo || 'Recortar imagen'}</h3>
          <button className="crop-modal__close" onClick={onCancelar} aria-label="Cerrar">✕</button>
        </div>

        {/* Toggles de ratio — solo se muestran si se pasan múltiples opciones */}
        {tieneMultiples && (
          <div className="crop-modal__ratios">
            {aspectos.map((op) => (
              <button
                key={op.label}
                className={`crop-modal__ratio-btn ${aspectoActivo === op.valor ? 'crop-modal__ratio-btn--active' : ''}`}
                onClick={() => handleCambiarAspecto(op.valor)}
                type="button"
              >
                {op.label}
              </button>
            ))}
          </div>
        )}

        {/* Área del cropper — necesita altura fija para que react-easy-crop funcione */}
        <div className="crop-modal__area">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspectoActivo}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* Slider de zoom */}
        <div className="crop-modal__zoom">
          <span>−</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="crop-modal__slider"
          />
          <span>+</span>
        </div>

        {consejo && (
          <p className="crop-modal__tip">
            💡 {consejo}
          </p>
        )}

        <div className="crop-modal__actions">
          <button className="pform__btn pform__btn--cancel" onClick={onCancelar}>
            Cancelar
          </button>
          <button
            className="pform__btn pform__btn--save"
            onClick={handleConfirmar}
            disabled={guardando || !pixelCrop}
          >
            {guardando ? 'Procesando…' : 'Confirmar recorte'}
          </button>
        </div>

      </div>
    </div>
  );
}

export default ImageCropperModal;
