import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
let conexionActiva = null;

export const conexion = async () => {
  if (!conexionActiva) {
    try {
      conexionActiva = await open({
        filename: './src/db/contraloriaQr.db',
        driver: sqlite3.Database
      });
      await conexionActiva.exec('PRAGMA foreign_keys = ON;');
/*
      
      await conexionActiva.exec(`CREATE TABLE IF NOT EXISTS Departamento (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL UNIQUE
      )`);

      // Inserta un departamento de ejemplo

      await conexionActiva.exec(`INSERT INTO Departamento (nombre) VALUES ('Informática')`);

      

      await conexionActiva.exec(`CREATE TABLE IF NOT EXISTS registrosQr (
        id TEXT PRIMARY KEY,
        nombre TEXT NOT NULL,
        descripcion TEXT NOT NULL,
        qrUrl TEXT,
        estado TEXT NOT NULL,
        observaciones TEXT NOT NULL,
        encargado TEXT NOT NULL,
        departamento_id INTEGER,
        FOREIGN KEY (departamento_id) REFERENCES Departamento(id)
        
      )`);
*/

      return conexionActiva;
    } catch (error) {
      console.error('Error de conexión:', error);
      throw error;
    }
  }
  return conexionActiva;
};