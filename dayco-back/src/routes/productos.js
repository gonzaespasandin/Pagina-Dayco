import { Router } from 'express';
import pool from '../config/database.js';
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

// Helper: mysql2 devuelve columnas JSON ya parseadas como objetos JS.
// Para columnas que lleguen como string (por compatibilidad), las parseamos igual.
const parsearProducto = (p) => {
    if (!p) return null;
    const camposJSON = ['features_hero', 'caracteristicas', 'galeria', 'especificaciones', 'variantes', 'aplicaciones'];
    const resultado = { ...p };
    for (const campo of camposJSON) {
        try {
            if (resultado[campo] === null || resultado[campo] === undefined) {
                resultado[campo] = [];
            } else if (typeof resultado[campo] === 'string') {
                resultado[campo] = JSON.parse(resultado[campo]);
            }
            // Si ya es objeto/array (mysql2 parsea JSON automáticamente), se deja como está
        } catch {
            resultado[campo] = [];
        }
    }
    return resultado;
};

// IMPORTANTE: esta ruta va ANTES de /:id para que Express no la interprete como un id.
router.post('/upload-imagen', verificarToken, upload.single('imagen'), (_req, res) => {
    if (!_req.file) {
        return res.status(400).json({ error: 'No se recibió ninguna imagen.' });
    }
    res.json({ url: `/uploads/${_req.file.filename}` });
});

// pool.query() devuelve [rows, fields]. Desestructuramos solo rows con [rows].
router.get('/', async (_req, res) => {
    const [rows] = await pool.query('SELECT * FROM productos');
    res.json(rows.map(parsearProducto));
});

router.get('/:id', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM productos WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
        return res.status(404).json({ error: 'Producto no encontrado.' });
    }
    res.json(parsearProducto(rows[0]));
});

router.post('/', verificarToken, upload.single('imagen'), async (req, res) => {
    const {
        titulo, descripcion, subtitulo, descripcion_larga,
        features_hero, caracteristicas, galeria,
        especificaciones, variantes, aplicaciones
    } = req.body;

    const imagenUrl = req.file ? `/uploads/${req.file.filename}` : null;

    // result.insertId es el equivalente de lastInsertRowid en SQLite
    const [result] = await pool.query(`
        INSERT INTO productos
          (titulo, descripcion, imagen_url, subtitulo, descripcion_larga,
           features_hero, caracteristicas, galeria, especificaciones, variantes, aplicaciones)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        titulo, descripcion || null, imagenUrl,
        subtitulo || null, descripcion_larga || null,
        features_hero || null, caracteristicas || null, galeria || null,
        especificaciones || null, variantes || null, aplicaciones || null
    ]);

    const [rows] = await pool.query('SELECT * FROM productos WHERE id = ?', [result.insertId]);
    res.status(201).json(parsearProducto(rows[0]));
});

router.put('/:id', verificarToken, upload.single('imagen'), async (req, res) => {
    const {
        titulo, descripcion, subtitulo, descripcion_larga,
        features_hero, caracteristicas, galeria,
        especificaciones, variantes, aplicaciones
    } = req.body;

    const [existing] = await pool.query('SELECT * FROM productos WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
        return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    const imagenUrl = req.file ? `/uploads/${req.file.filename}` : existing[0].imagen_url;

    await pool.query(`
        UPDATE productos SET
          titulo = ?, descripcion = ?, imagen_url = ?,
          subtitulo = ?, descripcion_larga = ?,
          features_hero = ?, caracteristicas = ?, galeria = ?,
          especificaciones = ?, variantes = ?, aplicaciones = ?
        WHERE id = ?
    `, [
        titulo, descripcion || null, imagenUrl,
        subtitulo || null, descripcion_larga || null,
        features_hero || null, caracteristicas || null, galeria || null,
        especificaciones || null, variantes || null, aplicaciones || null,
        req.params.id
    ]);

    const [rows] = await pool.query('SELECT * FROM productos WHERE id = ?', [req.params.id]);
    res.json(parsearProducto(rows[0]));
});

router.delete('/:id', verificarToken, async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM productos WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
        return res.status(404).json({ error: 'Producto no encontrado.' });
    }
    await pool.query('DELETE FROM productos WHERE id = ?', [req.params.id]);
    res.json({ mensaje: 'Producto eliminado correctamente.' });
});

export default router;
