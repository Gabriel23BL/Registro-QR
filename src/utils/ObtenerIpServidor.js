
import 'dotenv/config';


export const obtenerIpServidor = async () => {
    return process.env.IP_SERVIDOR || 'localhost';
}
