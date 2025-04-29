import { conexion } from '../db/conexion.js';

export class AuditModel {
    static async obtenerAuditoria() {
        try {
            const db = await conexion();
            const sql = `SELECT * FROM auditoria`;
            const auditoria = await db.all(sql);
            return auditoria;
        }
        catch (error) {
            console.error("[Modelo Auditoria] Error al obtener auditoría:", error.message);
            throw error;
        }
    }

    static async registrarCambiosUsuario(tipoAccion, tablaAfectada, campoAfectado, usuarioNombre, usuarioCedula,  fecha) {
        try {
            const db = await conexion();
            const sql = `INSERT INTO auditoria (tipo_accion, tabla_afectada, campo_afectado, usuario_nombre, usuario_cedula, fecha) VALUES (?, ?, ?, ?, ?, ?)`;
            await db.run(sql, [tipoAccion, tablaAfectada, campoAfectado, usuarioNombre, usuarioCedula,  fecha]);
        } catch (error) {
            console.error("[Modelo Auditoria] Error al registrar cambios:", error.message);
            throw error;
        }
    }
}