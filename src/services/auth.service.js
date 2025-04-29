import bcrypt from 'bcrypt';
import { ModeloUsuario } from '../Model/ModeloUsuario.js';
import { AuthenticationError } from '../utils/Errors.js';

export const authenticateUser = async (email, password) => {
    try {
        const usuario = await ModeloUsuario.obtenerPorEmail(email);
        if (!usuario) {
            throw new AuthenticationError('Usuario o contraseña incorrectas.');
        }

        const match = await bcrypt.compare(password, usuario.contraseña);
        if (!match) {
            throw new AuthenticationError('Usuario o contraseña incorrectas.');
        }
        return usuario;
    } catch (error) {
        console.error('Error en autenticación:', error.message);
        throw error; 
    }
};