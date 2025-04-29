import { conexion } from '../db/conexion.js';


export class ModeloUsuario {
    static async obtenerPorEmail(email) {
        const db = await conexion();
        try {
            return await db.get(
                'SELECT * FROM usuarios WHERE correo = ?',
                [email]
            );
        } catch (error) {
            throw error;
        }
    }

    static async listarUsuarios() {
        const db = await conexion();
        try {
            return await db.all('SELECT * FROM usuarios');
        } catch (error) {
            throw error;
        }
    }

    static async crearUsuario(cedula, nombre, correo, contraseña, rol) {
        const db = await conexion();
        try {
            const result = await db.run(
                'INSERT INTO usuarios (cedula, nombre, correo, contraseña, rol) VALUES (?, ?, ?, ?, ?)',
                [cedula, nombre, correo, contraseña, rol]
            );
            return result;
        } catch (error) {
            throw error;
        }
    }


    static async eliminarUsuario(id) {
        const db = await conexion();
        try {
            const result = await db.run(
                'DELETE FROM usuarios WHERE id = ?',
                [id]
            );
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async actualizarUsuario(nombre, correo, contraseña, rol, cedula, id) {
        const db = await conexion();
        try {
            const result = await db.run(
                'UPDATE usuarios SET nombre = ?, correo = ?, contraseña = ?, rol = ?, cedula = ? WHERE id = ?',
                [nombre, correo, contraseña, rol, cedula, id]
            );
            return result;
        } catch (error) {
            throw error;
        }
    }

  

}