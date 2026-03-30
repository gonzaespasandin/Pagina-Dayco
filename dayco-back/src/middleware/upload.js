import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MIME_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, join(__dirname, '../../uploads'));
    },
    filename: (_req, file, cb) => {
        const nombreUnico = `${Date.now()}-${file.originalname}`;
        cb(null, nombreUnico);
    },
});

const fileFilter = (_req, file, cb) => {
    if (!MIME_PERMITIDOS.includes(file.mimetype)) {
        const err = new Error('Solo se permiten imágenes JPG, PNG, WEBP o GIF.');
        err.esErrorTipoArchivo = true;
        return cb(err);
    }
    cb(null, true);
};

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter,
});

export default upload;
