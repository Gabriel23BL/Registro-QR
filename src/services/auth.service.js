import bcrypt from 'bcrypt';
import { ModeloUsuario } from '../Model/ModeloUsuario.js';

export const authenticateUser = async (res, email, password) => {
    const usuario = await ModeloUsuario.obtenerPorEmail(email);
    if (!usuario) {
        return res.status(404).json({ error: 'Credenciales invalidas' });
    }
    const match = await bcrypt.compare(password, usuario.contraseña);
    if (!match) {
        return res.status(404).json({ error: 'Credenciales invalidas' });
    }
    return usuario;
};