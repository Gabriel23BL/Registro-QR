import { AuditModel } from '../Model/ModelAuditoria.js';

export class ControladorAuditoria {
    async mostrarAuditoria(req, res) {
        try {
            const auditorias = await AuditModel.obtenerAuditoria();
            res.render('auditoria', { auditorias });
        } catch (error) {
            console.error("[Controlador Auditoria] Error al obtener auditoría:", error.message);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async registrarCambiosUsuario(tipoAccion, tablaAfectada, campoAfectado, usuarioNombre, usuarioCedula,  fecha) {
        try {
            console.log("[Controlador Auditoria] Registrando cambios:", tipoAccion, tablaAfectada, campoAfectado, usuarioNombre, usuarioCedula, fecha);
            await AuditModel.registrarCambiosUsuario(tipoAccion,tablaAfectada, campoAfectado, usuarioNombre, usuarioCedula, fecha);
        } catch (error) {
            console.error("[Controlador Auditoria] Error al registrar cambios:", error.message);
            throw error;
        }
    }
}
