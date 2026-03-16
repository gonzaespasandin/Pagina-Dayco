import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = Router();

const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASSWORD_HASH = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10);

router.post('/login', async (req, res) => {
    const { usuario, password } = req.body;

    if (usuario !== ADMIN_USER) {
        return res.status(401).json({ error: 'Credenciales incorrectas.' });
    }

    const passwordValida = bcrypt.compareSync(password, ADMIN_PASSWORD_HASH);

    if (!passwordValida) {
        return res.status(401).json({ error: 'Credenciales incorrectas.' });
    }

    const token = jwt.sign(
        { usuario: ADMIN_USER },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
    )

    res.json({ token });
});

export default router;

    