import { conexion } from '../db/conexion.js';

export class ModelDepartamento {
    static async obtenerDepartamentos() {
        try {
            const db = await conexion();
            return await db.all("SELECT * FROM Departamento");
        } catch (error) {
            console.error("Error en la consulta:", error.message);
            throw error;
        }
    }

    static async agregarDepartamento(nombre) {
        try {
            const db = await conexion();
            const sql = "INSERT INTO Departamento (nombre) VALUES (?)";
            await db.run(sql, [nombre]);
        } catch (error) {
            console.error("Error al agregar departamento:", error.message);
            throw error;
        }
    }

    static async editarDepartamento(id, nombre) {
        try {
            const db = await conexion();
            const sql = "UPDATE Departamento SET nombre = ? WHERE id = ?";
            await db.run(sql, [nombre, id]);
        } catch (error) {
            console.error("Error al editar departamento:", error.message);
            throw error;
        }
    }
    static async eliminarDepartamento(id) {
        try {
            const db = await conexion();
            const sql = "DELETE FROM Departamento WHERE id = ?";
            await db.run(sql, [id]);
        } catch (error) {
            console.error("Error al eliminar departamento:", error.message);
            throw error;
        }
    }
}