import { authenticateUser } from '../services/auth.service.js';
import { generateAuthToken } from '../utils/Jwt.js';
import { ModeloUsuario } from '../Model/ModeloUsuario.js';
import { ControladorAuditoria } from './ControllerAuditoria.js';
import { ModelDepartamento } from '../Model/ModelDepartamento.js';

import { formatoFecha } from '../utils/Fecha.js';
import bcrypt from 'bcrypt';
import { AuthenticationError, ValidationError } from '../utils/Errors.js';
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
            const { nombre, correo, cedula, rol, password, departamento } = req.body;

            if (!nombre || !correo || !cedula || !rol || !password || !departamento) {
                throw new ValidationError('Todos los campos son requeridos');
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            try {
                await ModeloUsuario.crearUsuario(cedula, nombre, correo, hashedPassword, rol, departamento);
                const fechaToday = await formatoFecha();
                const auditoriaRegistro = new ControladorAuditoria();
                console.log("Controlador de auditoría instanciado"); 
                await auditoriaRegistro.registrarCambiosUsuario(
                    'Creación',
                    'Usuarios',
                    `Nuevo usuario: ${nombre} (${cedula}) - Rol: ${rol}`,
                    req.user.nombre,
                    req.user.cedula,
                    fechaToday
                );
            } catch (error) {
                console.error(error); 
                throw error; 
            }
            res.status(200).json({ message: 'Usuario creado exitosamente.' });
        } catch (error) {
            if (error.code === 'SQLITE_CONSTRAINT') {
                if (error.message.includes('usuarios.cedula')) {
                    return res.status(400).json({ error: 'La cédula ya está registrada' });
                } else if (error.message.includes('usuarios.correo')) {
                    return res.status(400).json({ error: 'El correo ya está registrado' });
                }
            }
        }
    }

    async eliminarUsuario(req, res) {
        try {
            const { id } = req.params;
            let cedula = null
            await ModeloUsuario.obtenerPorId(id).then((usuario) => {
                cedula = usuario.cedula;
            }
            );

            const fechaToday = await formatoFecha();
            const auditoriaRegistro = new ControladorAuditoria();
            await auditoriaRegistro.registrarCambiosUsuario(
                'Eliminación',
                'Usuarios',
                `Usuario eliminado con la cédula: ${cedula}`,
                req.user.nombre,
                req.user.cedula,
                fechaToday
            );
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
            const { nombre, correo, rol, password, cedula, departamento } = req.body;
            const auditoriaRegistro = new ControladorAuditoria();

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

            if (!cedula || !nombre || !correo || !rol || !departamento) {
                throw new ValidationError('Todos los campos son requeridos');
            }

            const usuarioExistente = await ModeloUsuario.obtenerPorId(id);

            const nuevosDatos = {
                nombre: nombre || usuarioExistente.nombre,
                correo: correo || usuarioExistente.correo,
                rol: rol || usuarioExistente.rol,
                cedula: cedula || usuarioExistente.cedula,
                contraseña: usuarioExistente.contraseña,
                departamento: departamento || usuarioExistente.departamento_id
            };

            const cambios = [];
            if (nuevosDatos.nombre !== usuarioExistente.nombre) cambios.push('nombre');
            if (nuevosDatos.correo !== usuarioExistente.correo) cambios.push('correo');
            if (nuevosDatos.rol !== usuarioExistente.rol) cambios.push('rol');
            if (nuevosDatos.cedula !== usuarioExistente.cedula) cambios.push('cedula');
            if (nuevosDatos.contraseña !== usuarioExistente.contraseña) cambios.push('contraseña');
            if (nuevosDatos.departamento !== usuarioExistente.departamento) cambios.push('departamento');
            if (cambios.length === 0) {
                return res.status(200).json({ message: 'No se realizaron cambios en el usuario.' });
            }

            const fechaToday = await formatoFecha();
            await ModeloUsuario.actualizarUsuario(nombre, correo, rol, cedula, hashedPassword, departamento, id);
            await auditoriaRegistro.registrarCambiosUsuario(
                'Edición',
                'Usuarios',
                `Campos modificados: ${cambios.join(', ')}`,
                req.user.nombre,
                req.user.cedula,
                fechaToday
            );

            res.status(200).json({ message: 'Usuario actualizado exitosamente.' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }


    async mostrarUsuarios(req, res) {
        try {
            const usuarios = await ModeloUsuario.listarUsuarios();
            const departamentos = await ModelDepartamento.obtenerDepartamentos() 
            res.render('usuarios', { usuarios, departamentos });
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