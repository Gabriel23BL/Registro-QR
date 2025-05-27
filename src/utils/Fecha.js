
export const formatoFecha = async () => {
    const fecha = new Date();
    return fecha.toLocaleString('es-VE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    })
};


