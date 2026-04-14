import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import verificarToken from '../middleware/auth.js';

const router = Router();

const ADMIN_USER = process.env.ADMIN_USER;

let ADMIN_PASSWORD_HASH = null;
bcrypt.hash(process.env.ADMIN_PASSWORD, 10).then(hash => {
    ADMIN_PASSWORD_HASH = hash;
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Demasiados intentos de login. Esperá 15 minutos e intentá de nuevo.' },
});

router.post('/login', loginLimiter, async (req, res) => {
    const { usuario, password } = req.body;

    if (usuario !== ADMIN_USER) {
        return res.status(401).json({ error: 'Credenciales incorrectas.' });
    }

    const passwordValida = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);

    if (!passwordValida) {
        return res.status(401).json({ error: 'Credenciales incorrectas.' });
    }

    const token = jwt.sign(
        { usuario: ADMIN_USER },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
    );

    res.json({ token });
});

router.get('/verify', verificarToken, (req, res) => {
    res.json({ ok: true });
});

export default router;

    