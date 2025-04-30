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


    static async obtenerPorId(id) {
        const db = await conexion();
        try {
            return await db.get(
                'SELECT * FROM usuarios WHERE id = ?',
                [id]
            );
        } catch (error) {
            throw error;
        }
    }

    static async listarUsuarios() {
        const db = await conexion();
        try {
            return await db.all('SELECT usuarios.*, Departamento.nombre AS departamento_nombre FROM usuarios LEFT JOIN Departamento ON usuarios.departamento_id = Departamento.id;');
        } catch (error) {
            throw error;
        }
    }

    static async crearUsuario(cedula, nombre, correo, hashedPassword, rol, departamento_id) {
        const db = await conexion();
        try {
            const result = await db.run(
                'INSERT INTO usuarios (cedula, nombre, correo, contraseña, rol, departamento_id) VALUES (?, ?, ?, ?, ?, ?)',
                [cedula, nombre, correo, hashedPassword, rol, departamento_id]
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

    static async actualizarUsuario(nombre, correo, rol, cedula, contraseña, departamento_id, id) {
        const db = await conexion();
        try {
            const result = await db.run(
                'UPDATE usuarios SET nombre = ?, correo = ?, rol = ?, cedula = ?, contraseña = ?, departamento_id = ? WHERE id = ?',
                [nombre, correo, rol, cedula, contraseña, departamento_id, id]
            );
            return result;
        } catch (error) {
            throw error;
        }
    }

  

}