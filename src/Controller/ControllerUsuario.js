import { authenticateUser } from '../services/auth.service.js';
import { generateAuthToken } from '../utils/Jwt.js';
import { ModeloUsuario } from '../Model/ModeloUsuario.js';
import bcrypt from 'bcrypt';


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

    async agregarUsuario(req, res) {
        try {
            if (!req.body || Object.keys(req.body).length === 0) {
                throw new ValidationError('Cuerpo de solicitud vacío');
            }
            const { nombre, correo, cedula, rol, password } = req.body;
            if (!nombre || !correo || !cedula || !rol || !password) {
                throw new ValidationError('Todos los campos son requeridos');
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            await ModeloUsuario.crearUsuario(cedula, nombre, correo, hashedPassword, rol);
            res.status(200).json({ message: 'Usuario creado exitosamente.' });
        } catch (error) {
            if (error.code === 'SQLITE_CONSTRAINT' && error.message.includes('usuarios.cedula')) {
                res.status(500).json({ error: 'La cédula ya está registrada en el sistema' });
            } else if (error.code === 'SQLITE_CONSTRAINT' && error.message.includes('usuarios.correo')) {
                res.status(500).json({ error: 'El correo ya está registrado en el sistema' });
            }
        }
    }

    async eliminarUsuario(req, res) {
        try {
            const { id } = req.params;
            await ModeloUsuario.eliminarUsuario(id);
            res.status(200).json({ message: 'Usuario eliminado exitosamente.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }

    async actualizarUsuario(req, res) {
        try {
            const { id } = req.params;
            const { nombre, correo, rol, password, cedula } = req.body;
            if (!req.body || Object.keys(req.body).length === 0) {
                throw new ValidationError('Cuerpo de solicitud vacío');
            }

            let hashedPassword = null;
            if (password) {
                hashedPassword = await bcrypt.hash(password, 10);
            } else {
                const usuario = await ModeloUsuario.obtenerPorEmail(correo);
                if (!usuario) {
                    throw new ValidationError('Usuario no encontrado');
                }
                hashedPassword = usuario.contraseña;
            }

            if (!cedula || !nombre || !correo || !rol) {
                throw new ValidationError('Todos los campos son requeridos');
            }
            await ModeloUsuario.actualizarUsuario(nombre, correo, hashedPassword, rol, cedula, id );
            res.status(200).json({ message: 'Usuario actualizado exitosamente.' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }




    async mostrarUsuarios(req, res) {
        try {
            const usuarios = await ModeloUsuario.listarUsuarios();
            res.render('usuarios', { usuarios });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }


    async logout(req, res) {
        res.clearCookie('jwt');
        res.redirect('/login');
    }

}