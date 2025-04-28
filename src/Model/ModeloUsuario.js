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

    static async listarUsuarios(){
        const db = await conexion();
        try {
            return await db.all('SELECT * FROM usuarios');
        } catch (error) {
            throw error;
        }
    }

}