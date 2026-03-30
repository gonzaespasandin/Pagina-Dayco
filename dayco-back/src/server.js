import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import productosRoutes from './routes/productos.js';
import contenidoRoutes from './routes/contenido.js';
import casinosRoutes from './routes/casinos.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/contenido', contenidoRoutes);
app.use('/api/casinos', casinosRoutes);
app.use('/uploads', express.static(join(__dirname, '../uploads')));

app.get('/', (req, res) => {
    res.json({ mensaje: 'API Dayco Gaming v2' });
});

// ── Manejador global de errores ──────────────────────────────────────────────
// Debe estar DESPUÉS de todas las rutas. Express lo reconoce como error handler
// por tener 4 parámetros: (err, req, res, next).
//
// ¿Por qué acá y no en cada ruta?
// Multer lanza sus errores ANTES de entrar al handler de la ruta (es un middleware
// previo), así que no se pueden capturar con try/catch dentro del router.
// El único lugar que los recibe es este middleware de error global.
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
    // Multer: archivo demasiado grande (límite: 5 MB)
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'La imagen no puede superar los 5 MB.' });
    }

    // Nuestro fileFilter: tipo de archivo no permitido
    if (err.esErrorTipoArchivo) {
        return res.status(400).json({ error: err.message });
    }

    // Cualquier otro error inesperado
    console.error('[Error no controlado]', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
