import { authenticateUser } from '../services/auth.service.js';
import { generateAuthToken } from '../utils/Jwt.js';
import { AuthenticationError, ValidationError } from '../utils/Errors.js'; // Importa el error personalizado
import 'dotenv/config';

export class ControladorUsuario {
    async login(req, res) {
        try {
            if (!req.body || Object.keys(req.body).length === 0) {
                throw new ValidationError('Cuerpo de solicitud vacío');
            }
            const { email, password } = req.body;
            if (!email?.trim() || !password?.trim()) {
                throw new ValidationError('Email y contraseña son requeridos');
            }
            const usuario = await authenticateUser(email, password);
            const payload = {
                rol: usuario.rol,
                email: usuario.correo,
                nombre: usuario.nombre,
                cedula: usuario.cedula
            };
            const tokenAuth = generateAuthToken(payload);
            res.cookie('jwt', tokenAuth);
            return res.redirect('/');
        } catch (error) {
            let errorMessage = 'Error interno del servidor';
            let statusCode = 500;
            if (error instanceof ValidationError) {
                statusCode = 400;
                errorMessage = error.message;
            } else if (error instanceof AuthenticationError) {
                statusCode = 401;
                errorMessage = error.message;
            }

            return res.redirect(`/login?error=${encodeURIComponent(errorMessage)}`);
        }
    }
    async logout(req, res) {
        res.clearCookie('jwt');
        res.redirect('/login');
    }

}