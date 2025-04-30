export const validarCampos = (id, nombre, descripcion, estado, observaciones, encargado, departamento_id) => {
    if (!id || !/^\d{3}$/.test(id)) {
        throw new Error('El ID debe ser un número de exactamente 3 dígitos.');
      }
      if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
        throw new Error('El nombre es obligatorio.');
      }
      if (!descripcion || typeof descripcion !== 'string' || descripcion.trim() === '') {
        throw new Error('La descripción es obligatoria.');
      }
      if (!departamento_id) {
        throw new Error('El departamento es obligatorio.');
      }
      if (!estado || !['Activo', 'Inactivo'].includes(estado)) {
        throw new Error('El estado debe ser "Activo" o "Inactivo".');
      }
      if (observaciones && typeof observaciones !== 'string') {
        throw new Error('Las observaciones deben ser un texto.');
      }
      if (!encargado || typeof encargado !== 'string' || encargado.trim() === '') {
        throw new Error('El responsable es obligatorio.');
      }
}
