import bcrypt from 'bcrypt';

export const detectarCambiosUsuario = async (usuarioExistente, nuevosDatosRequest) => {
    const nuevosDatos = {
        nombre: nuevosDatosRequest.nombre || usuarioExistente.nombre,
        correo: nuevosDatosRequest.correo || usuarioExistente.correo,
        rol: nuevosDatosRequest.rol || usuarioExistente.rol,
        cedula: nuevosDatosRequest.cedula || usuarioExistente.cedula,
        contraseña: usuarioExistente.contraseña 
    };

    if (nuevosDatosRequest.password) {
        const coincide = await bcrypt.compare(nuevosDatosRequest.password, usuarioExistente.contraseña);
        if (!coincide) {
            nuevosDatos.contraseña = await bcrypt.hash(nuevosDatosRequest.password, 10);
        }
    }

    const cambios = [];
    const camposRevisar = ['nombre', 'correo', 'rol', 'cedula', 'contraseña'];
    
    camposRevisar.forEach(campo => {
        if (nuevosDatos[campo] !== usuarioExistente[campo]) {
            cambios.push(campo);
        }
    });

    return { nuevosDatos, cambios };
};

export const validarCamposRequeridos = (datos) => {
    const camposRequeridos = ['cedula', 'nombre', 'correo', 'rol'];
    const faltantes = camposRequeridos.filter(campo => !datos[campo]);
    
    if (faltantes.length > 0) {
        throw new Error(`Campos requeridos faltantes: ${faltantes.join(', ')}`);
    }
};