import { conexion } from '../db/conexion.js';

export class ModeloRegistro {
  static async obtenerRegistros() {
    try {
      const db = await conexion();
      return await db.all("SELECT r.*, d.id AS departamento_id, d.nombre AS departamento_nombre FROM registrosQr r LEFT JOIN Departamento d ON r.departamento_id = d.id");
    } catch (error) {
      console.error("[Modelo] Error en la consulta:", error.message);
      throw error;
    }
  }

  static async crearRegistro(datos, qrUrl) {
    try {
      const db = await conexion();
      const sql = `INSERT INTO registrosQr (id, nombre, descripcion, qrUrl, estado, observaciones, encargado, departamento_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
      const params = [datos.id, datos.nombre, datos.descripcion, qrUrl, datos.status, datos.observaciones, datos.encargado, datos.departamento_id];
      await db.run(sql, params);
    } catch (error) {
      console.error("[Modelo] Error al crear el registro:", error.message);
      throw error;
    }
  }

  static async actualizarRegistro(registro_id, qrUrl, datos) {
    try {
      const db = await conexion();
      const sql = `UPDATE registrosQr SET id = ?, nombre = ?, descripcion = ?, qrUrl = ?, estado = ?, observaciones = ?, encargado = ?, departamento_id = ? WHERE registro_id = ?`;
      const params = [datos.id, datos.nombre, datos.descripcion, qrUrl, datos.estado, datos.observaciones, datos.encargado, datos.departamento, registro_id];
      await db.run(sql, params);
    } catch (error) {
      console.error("[Modelo] Error al actualizar el registro:", error.message);
      throw error;
    }
  }

  static async eliminarRegistro(registro_id) {
    try {
      const db = await conexion();
      const sql = `DELETE FROM registrosQr WHERE registro_id = ?`;
      await db.run(sql, [registro_id]);
    } catch (error) {
      console.error("[Modelo] Error al eliminar el registro:", error.message);
      throw error;
    }
  }

  static async buscarPorId(id) {
    const db = await conexion();
    const [resultado] = await db.all('SELECT r.*, d.id AS departamento_id, d.nombre AS departamento_nombre FROM registrosQr r LEFT JOIN Departamento d ON r.departamento_id = d.id WHERE r.id = ?', [id]);
    return resultado;
  }

  static async buscarDepartamento(){
    try {
      const db = await conexion();
      const sql = `SELECT * FROM Departamento`;
      return await db.all(sql);
    } catch (error) {
      console.error("[Modelo] Error en la consulta:", error.message);
      throw error;
    }
  }


  static async qrUpdate(id, qrUrl) {
    try {
      const db = await conexion();
      const sql = `UPDATE registrosQr SET qrUrl = ? WHERE id = ?`;
      await db.run(sql, [qrUrl, id]);
    } catch (error) {
      console.error("[Modelo] Error al actualizar el QR:", error.message);
      throw error;
    }
  }

}


