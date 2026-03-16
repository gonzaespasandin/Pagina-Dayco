import { Router } from 'express';
import db from '../config/database.js';
import verificarToken from '../middleware/auth.js';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = Router();

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, join(__dirname, '../../uploads'));
    },
    filename: (_req, file, cb) => {
        const nombreUnico = `${Date.now()}-${file.originalname}`;
        cb(null, nombreUnico);
    }
});

const upload = multer({ storage });

// Helper: los campos JSON se guardan como strings en SQLite.
// Al devolverlos al frontend los parseamos para que lleguen como arrays/objetos.
const parsearProducto = (p) => {
    if (!p) return null;
    const camposJSON = ['features_hero', 'caracteristicas', 'galeria', 'especificaciones', 'variantes', 'aplicaciones'];
    const resultado = { ...p };
    for (const campo of camposJSON) {
        try {
            resultado[campo] = p[campo] ? JSON.parse(p[campo]) : [];
        } catch {
            resultado[campo] = [];
        }
    }
    return resultado;
};

// Endpoint para subir imágenes de galería individualmente.
// Devuelve la URL del archivo guardado para que el frontend la agregue al array.
// IMPORTANTE: esta ruta va ANTES de /:id para que Express no la interprete como un id.
router.post('/upload-imagen', verificarToken, upload.single('imagen'), (_req, res) => {
    if (!_req.file) {
        return res.status(400).json({ error: 'No se recibió ninguna imagen.' });
    }
    res.json({ url: `/uploads/${_req.file.filename}` });
});

router.get('/', (req, res) => {
    const productos = db.prepare('SELECT * FROM productos').all();
    res.json(productos.map(parsearProducto));
});

router.get('/:id', (req, res) => {
    const producto = db.prepare('SELECT * FROM productos WHERE id = ?').get(req.params.id);
    if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado.' });
    }
    res.json(parsearProducto(producto));
});

router.post('/', verificarToken, upload.single('imagen'), (req, res) => {
    const {
        titulo, descripcion, subtitulo, descripcion_larga,
        features_hero, caracteristicas, galeria,
        especificaciones, variantes, aplicaciones
    } = req.body;

    const imagenUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const result = db.prepare(`
        INSERT INTO productos
          (titulo, descripcion, imagen_url, subtitulo, descripcion_larga,
           features_hero, caracteristicas, galeria, especificaciones, variantes, aplicaciones)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
        titulo, descripcion || null, imagenUrl,
        subtitulo || null, descripcion_larga || null,
        features_hero || null, caracteristicas || null, galeria || null,
        especificaciones || null, variantes || null, aplicaciones || null
    );

    const nuevoProducto = db.prepare('SELECT * FROM productos WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(parsearProducto(nuevoProducto));
});

router.put('/:id', verificarToken, upload.single('imagen'), (req, res) => {
    const {
        titulo, descripcion, subtitulo, descripcion_larga,
        features_hero, caracteristicas, galeria,
        especificaciones, variantes, aplicaciones
    } = req.body;

    const productoActual = db.prepare('SELECT * FROM productos WHERE id = ?').get(req.params.id);
    if (!productoActual) {
        return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    const imagenUrl = req.file ? `/uploads/${req.file.filename}` : productoActual.imagen_url;

    db.prepare(`
        UPDATE productos SET
          titulo = ?, descripcion = ?, imagen_url = ?,
          subtitulo = ?, descripcion_larga = ?,
          features_hero = ?, caracteristicas = ?, galeria = ?,
          especificaciones = ?, variantes = ?, aplicaciones = ?
        WHERE id = ?
    `).run(
        titulo, descripcion || null, imagenUrl,
        subtitulo || null, descripcion_larga || null,
        features_hero || null, caracteristicas || null, galeria || null,
        especificaciones || null, variantes || null, aplicaciones || null,
        req.params.id
    );

    const productoActualizado = db.prepare('SELECT * FROM productos WHERE id = ?').get(req.params.id);
    res.json(parsearProducto(productoActualizado));
});

router.delete('/:id', verificarToken, (req, res) => {
    const producto = db.prepare('SELECT * FROM productos WHERE id = ?').get(req.params.id);
    if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado.' });
    }
    db.prepare('DELETE FROM productos WHERE id = ?').run(req.params.id);
    res.json({ mensaje: 'Producto eliminado correctamente.' });
});

export default router;
