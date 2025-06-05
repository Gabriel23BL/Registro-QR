const modal = document.getElementById('editModal');
function mostrarAlerta(mensaje, color = 'bg-green-500') {
    const alerta = document.getElementById('alertaBonita');
    const texto  = document.getElementById('mensajeAlerta');
    const icon   = document.getElementById('alertIcon');
    texto.textContent = mensaje;
    alerta.className = `fixed top-5 right-5 text-white px-6 py-4 rounded-lg shadow-lg animate-fade-in-down z-50 ${color}`;
    icon.className = color === 'bg-green-500'
      ? 'bi bi-check-circle mr-2'
      : 'bi bi-exclamation-triangle mr-2';
    alerta.classList.remove('hidden');
    setTimeout(() => alerta.classList.add('hidden'), 3000);
  }
  


function openEditModal(DateID, id, nombre, descripcion, estado, observaciones, encargado, departamento) {
    document.getElementById('editDateID').value = DateID;
    document.getElementById('editId').value = id;
    document.getElementById('editNombre').value = nombre;
    document.getElementById('editDescripcion').value = descripcion;
    document.getElementById('editStatus').value = estado;
    document.getElementById('editObservaciones').value = observaciones;
    document.getElementById('editEncargado').value = encargado;
    document.getElementById('editDepartamento').value = departamento;
    modal.classList.remove('hidden');
}

function closeModal() {
    modal.classList.add('hidden');
}

document.getElementById('registroForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const form = e.target;
    const data = Object.fromEntries(
      Array.from(new FormData(form))
          .map(([key, value]) => [
              key, 
              typeof value === 'string' ? value.trim() : value
          ])
  );
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
  
      if (res.ok) {
        mostrarAlerta(result.message, 'bg-green-500');
        setTimeout(() => window.location.reload(), 1000);
      } else {
        const txt = result.error || result.message || 'Error inesperado';
        mostrarAlerta(txt, 'bg-red-500');
        console.error('Error backend:', result);
      }
    } catch (networkErr) {
      console.error('Error de red o JS:', networkErr);
      mostrarAlerta('No se pudo conectar al servidor', 'bg-red-500');
    }
  });
  



document.getElementById('editForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(e.target); 
    const dataId = formData.get('DateID');
    const url = `/registrar/${dataId}/update`;
    const data = Object.fromEntries(
      Array.from(new FormData(e.target))
          .map(([key, value]) => [
              key, 
              typeof value === 'string' ? value.trim() : value
          ])
  );
    console.log(data)
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
  
      const result = await res.json();
      if (!res.ok) throw result;
      mostrarAlerta(result.message, 'bg-blue-500');
      setTimeout(() => window.location.reload(), 1000);
  
    } catch (err) {
      console.log(err);
      mostrarAlerta(err.error || 'Error desconocido', 'bg-red-500');
    }
  });



    let registroToDelete = null;
    function openDeleteModal(DateID, id, nombre, descripcion) {
        registroToDelete = { DateID };
        document.getElementById('deleteId').textContent = id;
        document.getElementById('deleteNombre').textContent = nombre;
        document.getElementById('deleteDescripcion').textContent = descripcion;
        document.getElementById('deleteModal').classList.remove('hidden');
    }

    function closeDeleteModal() {
        document.getElementById('deleteModal').classList.add('hidden');
        registroToDelete = null;
    }

    async function confirmDelete() {
        try {
        
          const res = await fetch(`/registrar/${registroToDelete.DateID}/delete`, { method: 'POST' });
          const result = await res.json();
          if (!res.ok) throw result;
          mostrarAlerta(result.message, 'bg-red-500');
          setTimeout(() => window.location.reload(), 1000);
      
        } catch (err) {
          mostrarAlerta(err.error || 'Error desconocido', 'bg-red-500');
        }
      }



    