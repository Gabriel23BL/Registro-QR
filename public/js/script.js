const modal = document.getElementById('editModal');

function openEditModal(firestoreId, id, nombre, descripcion, departamento) {
    document.getElementById('editFirestoreId').value = firestoreId;
    document.getElementById('editId').value = id;
    document.getElementById('editNombre').value = nombre;
    document.getElementById('editDescripcion').value = descripcion;
    document.getElementById('editDepartamento').value = departamento;
    modal.classList.remove('hidden');
}

function closeModal() {
    modal.classList.add('hidden');
}

document.getElementById('editForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const firestoreId = formData.get('firestoreId');
    try {
        const response = await fetch(`/registrar/${firestoreId}/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: formData.get('id'),
                nombre: formData.get('nombre'),
                descripcion: formData.get('descripcion'),
                departamento: formData.get('departamento')
            })
        });

        if (response.ok) {
            window.location.reload();
        }
    } catch (error) {
        console.error('Error:', error);
    }
});



let registroToDelete = null;
    function openDeleteModal(firestoreId, id, nombre, descripcion, departamento) {
        registroToDelete = { firestoreId };
        document.getElementById('deleteId').textContent = id;
        document.getElementById('deleteNombre').textContent = nombre;
        document.getElementById('deleteDescripcion').textContent = descripcion;
        document.getElementById('deleteDepartamento').textContent = departamento;
        document.getElementById('deleteModal').classList.remove('hidden');
    }

    function closeDeleteModal() {
        document.getElementById('deleteModal').classList.add('hidden');
        registroToDelete = null;
    }

    async function confirmDelete() {
        if (!registroToDelete) return;

        try {
            const response = await fetch(`/registrar/${registroToDelete.firestoreId}/delete`, {
                method: 'POST'
            });

            if (response.ok) {
                closeDeleteModal();
                window.location.reload();
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al eliminar el registro');
        }
    }