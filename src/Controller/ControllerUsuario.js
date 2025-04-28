import { authenticateUser } from '../services/auth.service.js';
import { generateAuthToken } from '../utils/Jwt.js';
import 'dotenv/config';

export class ControladorUsuario {
    async login(req, res) {
        const { email, password } = req.body;
        const usuario = await authenticateUser(res, email, password);
        const payload = {
            rol: usuario.rol,
            email: usuario.correo,
            nombre: usuario.nombre,
            cedula: usuario.cedula
        };

        const tokenAuth = generateAuthToken(payload);
        res.cookie('jwt', tokenAuth);
        res.redirect('/');
    }

    


    async logout(req, res) {
        res.clearCookie('jwt');
        res.redirect('/login');
    }

}