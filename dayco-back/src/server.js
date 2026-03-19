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

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/contenido', contenidoRoutes);
app.use('/api/casinos', casinosRoutes);
app.use('/uploads', express.static(join(__dirname, '../uploads')));

app.get('/', (req, res) => {
    res.json({ mensaje: 'API Dayco Gaming v2' });
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
