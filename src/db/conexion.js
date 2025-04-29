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

      return conexionActiva;
    } catch (error) {
      console.error('Error de conexión:', error);
      throw error;
    }
  }
  return conexionActiva;
};