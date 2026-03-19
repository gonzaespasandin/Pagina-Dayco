import { Router } from 'express';
import pool from '../config/database.js';
import verificarToken from '../middleware/auth.js';

const router = Router();

router.get('/', async (_req, res) => {
    const [rows] = await pool.query('SELECT * FROM nosotros_stats');
    res.json(rows);
});

router.post('/', verificarToken, async (req, res) => {
    const { titulo, valor } = req.body;

    const [result] = await pool.query(
        'INSERT INTO nosotros_stats (titulo, valor) VALUES (?, ?)',
        [titulo, valor]
    );

    const [rows] = await pool.query('SELECT * FROM nosotros_stats WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
});

router.put('/:id', verificarToken, async (req, res) => {
    const { titulo, valor } = req.body;

    const [existing] = await pool.query('SELECT * FROM nosotros_stats WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
        return res.status(404).json({ error: 'Estadística no encontrada.' });
    }

    await pool.query(
        'UPDATE nosotros_stats SET titulo = ?, valor = ? WHERE id = ?',
        [titulo, valor, req.params.id]
    );

    const [rows] = await pool.query('SELECT * FROM nosotros_stats WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
});

router.delete('/:id', verificarToken, async (req, res) => {
    const [existing] = await pool.query('SELECT * FROM nosotros_stats WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
        return res.status(404).json({ error: 'Estadística no encontrada.' });
    }

    await pool.query('DELETE FROM nosotros_stats WHERE id = ?', [req.params.id]);
    res.json({ mensaje: 'Estadística eliminada correctamente.' });
});

export default router;
