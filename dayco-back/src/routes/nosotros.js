import { Router } from 'express';
import pool from '../config/database.js';
import verificarToken from '../middleware/auth.js';
import upload, { procesarImagen } from '../middleware/upload.js';

const router = Router();

function sanitizarTexto(texto) {
    if (typeof texto !== 'string') return '';
    return texto.replace(/<[^>]*>/g, '').trim();
}

router.get('/', async (_req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM nosotros_contenido WHERE id = 1');
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Contenido no encontrado.' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error('[nosotros] GET error:', err);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

router.put('/', verificarToken, upload.single('imagen'), procesarImagen, async (req, res) => {
    console.log('[nosotros] PUT alcanzado — req.file:', req.file ? req.file.filename : 'sin archivo');
    try {
        const subtexto_foto = sanitizarTexto(req.body.subtexto_foto ?? '');
        const texto_lead    = sanitizarTexto(req.body.texto_lead    ?? '');
        const texto_cuerpo  = sanitizarTexto(req.body.texto_cuerpo  ?? '');
        console.log('[nosotros] campos — lead:', !!texto_lead, 'cuerpo:', !!texto_cuerpo);

        if (!texto_lead || !texto_cuerpo) {
            return res.status(400).json({ error: 'texto_lead y texto_cuerpo son obligatorios.' });
        }

        const [existing] = await pool.query('SELECT imagen_url FROM nosotros_contenido WHERE id = 1');
        const imagen_url = req.file
            ? `/uploads/${req.file.filename}`
            : (existing[0]?.imagen_url ?? null);

        await pool.query(`
            INSERT INTO nosotros_contenido (id, imagen_url, subtexto_foto, texto_lead, texto_cuerpo)
            VALUES (1, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                imagen_url    = VALUES(imagen_url),
                subtexto_foto = VALUES(subtexto_foto),
                texto_lead    = VALUES(texto_lead),
                texto_cuerpo  = VALUES(texto_cuerpo)
        `, [imagen_url, subtexto_foto, texto_lead, texto_cuerpo]);

        const [rows] = await pool.query('SELECT * FROM nosotros_contenido WHERE id = 1');
        res.json(rows[0]);
    } catch (err) {
        console.error('[nosotros] PUT error:', err);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

export default router;
