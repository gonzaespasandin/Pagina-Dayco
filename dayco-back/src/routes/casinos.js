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
    destination: (req, file, cb) => {
        cb(null, join(__dirname, '../../uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

router.get('/', (req, res) => {
    const casinos = db.prepare('SELECT * FROM casinos ORDER BY orden ASC').all();
    res.json(casinos);
});

router.post('/', verificarToken, upload.single('logo'), (req, res) => {
    const { nombre, orden } = req.body;
    const logoUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const result = db.prepare('INSERT INTO casinos (nombre, logo_url, orden) VALUES (?, ?, ?)').run(nombre, logoUrl, orden || 0);

    const nuevo = db.prepare('SELECT * FROM casinos WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(nuevo);

});

router.put('/:id', verificarToken, upload.single('logo'), (req, res) => {
    const { nombre, orden } = req.body;
    const actual = db.prepare('SELECT * FROM casinos WHERE id = ?').get(req.params.id);

    if (!actual) return res.status(404).json({ error: 'Casino no encontrado.' });

    const logoUrl = req.file ? `/uploads/${req.file.filename}` : actual.logo_url;

    db.prepare('UPDATE casinos SET nombre = ?, logo_url = ?, orden = ? WHERE id = ?').run(nombre, logoUrl, orden || 0, req.params.id);

    const actualizado = db.prepare('SELECT * FROM casinos WHERE id = ?').get(req.params.id);

    res.json(actualizado);

});

router.delete('/:id', verificarToken, (req, res) => {
    const casino = db.prepare('SELECT * FROM casinos WHERE id = ?').get(req.params.id);

    if (!casino) return res.status(404).json({ error: 'Casino no encontrado.' });

    db.prepare('DELETE FROM casinos WHERE id = ?').run(req.params.id);
    res.json({ mensaje: 'Casino eliminado correctamente.' });

});

export default router;