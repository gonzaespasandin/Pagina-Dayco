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
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1';

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

app.use((err, _req, res, _next) => {
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'La imagen no puede superar los 5 MB.' });
    }

    if (err.esErrorTipoArchivo) {
        return res.status(400).json({ error: err.message });
    }

    console.error('[Error no controlado]', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
});

app.listen(PORT, () => {
    console.log(`Servidor Dayco Gaming v2 corriendo en http://${HOST}:${PORT}`);
});
