
import os from 'os';
export const obtenerIpServidor = async () => {
    const interfaces = os.networkInterfaces();
    for (const nombreInterfaz in interfaces) {
      const interfaz = interfaces[nombreInterfaz];
      for (const config of interfaz) {
        if (config.family === 'IPv4' && !config.internal) {
          return config.address;
        }
      }
    }
    return 'localhost';
}
