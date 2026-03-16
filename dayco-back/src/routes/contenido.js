import { Router } from 'express';
import db from '../config/database.js';
import verificarToken from '../middleware/auth.js';

const router = Router();

router.get('/', (req, res) => {
    const stats = db.prepare('SELECT * FROM nosotros_stats').all();
    res.json(stats);
});

router.post('/', verificarToken, (req, res) => {
    const { titulo, valor } = req.body;

    const result = db.prepare('INSERT INTO nosotros_stats (titulo, valor) VALUES (?, ?)').run(titulo, valor);

    const nueva = db.prepare('SELECT * FROM nosotros_stats WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json(nueva);
});

router.put('/:id', verificarToken, (req, res) => {
    const { titulo, valor } = req.body;

    const stat = db.prepare('SELECT * FROM nosotros_stats WHERE id = ?').get(req.params.id);

    if (!stat) {
        return res.status(404).json({ error: 'Estadística no encontrada.' });
    }

    db.prepare('UPDATE nosotros_stats SET titulo = ?, valor = ? WHERE id = ?').run(titulo, valor, req.params.id);

    const actualizada = db.prepare('SELECT * FROM nosotros_stats WHERE id = ?').get(req.params.id);
    res.json(actualizada);
});

router.delete('/:id', verificarToken, (req, res) => {
    const stat = db.prepare('SELECT * FROM nosotros_stats WHERE id = ?').get(req.params.id);

    if (!stat) {
        return res.status(404).json({ error: 'Estadística no encontrada.' });
    }

    db.prepare('DELETE FROM nosotros_stats WHERE id = ?').run(req.params.id);
    res.json({ mensaje: 'Estadística eliminada correctamente.' });
});

export default router;