import { Router } from 'express';
import pool from '../config/database.js';
import verificarToken from '../middleware/auth.js';
import upload, { procesarImagen } from '../middleware/upload.js';

const router = Router();

router.get('/', async (_req, res) => {
    const [rows] = await pool.query('SELECT * FROM casinos ORDER BY orden ASC');
    res.json(rows);
});

router.post('/', verificarToken, upload.single('logo'), procesarImagen, async (req, res) => {
    const { nombre, orden } = req.body;
    const logoUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const [result] = await pool.query(
        'INSERT INTO casinos (nombre, logo_url, orden) VALUES (?, ?, ?)',
        [nombre, logoUrl, orden || 0]
    );

    const [rows] = await pool.query('SELECT * FROM casinos WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
});

router.put('/:id', verificarToken, upload.single('logo'), procesarImagen, async (req, res) => {
    const { nombre, orden } = req.body;

    const [existing] = await pool.query('SELECT * FROM casinos WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ error: 'Casino no encontrado.' });

    const logoUrl = req.file ? `/uploads/${req.file.filename}` : existing[0].logo_url;

    await pool.query(
        'UPDATE casinos SET nombre = ?, logo_url = ?, orden = ? WHERE id = ?',
        [nombre, logoUrl, orden || 0, req.params.id]
    );

    const [rows] = await pool.query('SELECT * FROM casinos WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
});

router.delete('/:id', verificarToken, async (req, res) => {
    const [existing] = await pool.query('SELECT * FROM casinos WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ error: 'Casino no encontrado.' });

    await pool.query('DELETE FROM casinos WHERE id = ?', [req.params.id]);
    res.json({ mensaje: 'Casino eliminado correctamente.' });
});

export default router;
