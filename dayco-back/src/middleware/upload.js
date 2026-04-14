import multer from 'multer';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { writeFile } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const UPLOADS_DIR = join(__dirname, '../../uploads');
const MIME_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// Multer guarda en memoria para que sharp procese antes de escribir a disco
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (!MIME_PERMITIDOS.includes(file.mimetype)) {
            const err = new Error('Solo se permiten imágenes JPG, PNG, WEBP o GIF.');
            err.esErrorTipoArchivo = true;
            return cb(err);
        }
        cb(null, true);
    },
});

/**
 * Middleware que convierte la imagen subida a WebP comprimida con sharp.
 * Se encadena después de upload.single() o upload.fields().
 * Escribe el archivo a disco y actualiza req.file para que el resto
 * del código siga funcionando igual.
 */
export async function procesarImagen(req, _res, next) {
    if (!req.file) return next();

    try {
        const nombreUnico = `${Date.now()}-imagen-recortada.webp`;
        const destino = join(UPLOADS_DIR, nombreUnico);

        await sharp(req.file.buffer)
            .rotate()                          // respeta EXIF orientation
            .resize({ width: 1920, withoutEnlargement: true })
            .webp({ quality: 82 })
            .toFile(destino);

        // Sobreescribir req.file para que rutas existentes no cambien
        req.file.filename = nombreUnico;
        req.file.path = destino;
        req.file.mimetype = 'image/webp';

        next();
    } catch (err) {
        next(err);
    }
}

export default upload;
