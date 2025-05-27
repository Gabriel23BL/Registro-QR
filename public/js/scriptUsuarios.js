
function mostrarAlerta(mensaje, color = 'bg-green-500') {
    const alerta = document.getElementById('alertaBonita');
    const texto = document.getElementById('mensajeAlerta');
    const icon = document.getElementById('alertIcon');
    texto.textContent = mensaje;
    alerta.className = `fixed top-5 right-5 text-white px-6 py-4 rounded-lg shadow-lg animate-fade-in-down z-50 ${color}`;
    icon.className = color === 'bg-green-500'
        ? 'bi bi-check-circle mr-2'
        : 'bi bi-exclamation-triangle mr-2';
    alerta.classList.remove('hidden');
    setTimeout(() => alerta.classList.add('hidden'), 3000);
}


let currentUserIdToDelete = null;

function openAddUserModal() {
    document.getElementById('addUserModal').classList.remove('hidden');
}

function closeAddUserModal() {
    document.getElementById('addUserModal').classList.add('hidden');
}

function openEditUserModal(id, nombre, correo, cedula, rol, departamento) {
    document.getElementById('editUserId').value = id;
    document.getElementById('editUserNombre').value = nombre;
    document.getElementById('editUserCorreo').value = correo;
    document.getElementById('editUserCedula').value = cedula;
    document.getElementById('editUserRol').value = rol;
    document.getElementById('editUserDepartamento').value = departamento;
    document.getElementById('editUserModal').classList.remove('hidden');
}

function closeEditUserModal() {
    document.getElementById('editUserModal').classList.add('hidden');
}

function openDeleteUserModal(id, nombre, correo, cedula, rol) {
    currentUserIdToDelete = id;
    document.getElementById('deleteUserName').textContent = nombre;
    document.getElementById('deleteUserEmail').textContent = correo;
    document.getElementById('deleteUserCedula').textContent = cedula;
    document.getElementById('deleteUserRol').textContent = rol;
    document.getElementById('deleteUserModal').classList.remove('hidden');
}

function closeDeleteUserModal() {
    document.getElementById('deleteUserModal').classList.add('hidden');
    currentUserIdToDelete = null;
}


async function confirmDeleteUser() {
try {

  const res = await fetch(`/usuarios/eliminar/${currentUserIdToDelete}`, { method: 'POST' });
  const result = await res.json();
  if (!res.ok) throw result;
  mostrarAlerta(result.message, 'bg-red-500');
  setTimeout(() => window.location.reload(), 1000);

} catch (err) {
  mostrarAlerta(err.error || 'Error desconocido', 'bg-red-500');
}
}



document.getElementById('addUserForm').addEventListener('submit', async function (e) {
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

document.getElementById('editUserForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const id = formData.get('id');
    const url = `/usuario/update/${id}`;
    const data = Object.fromEntries(
        Array.from(new FormData(e.target))
            .map(([key, value]) => [
                key,
                typeof value === 'string' ? value.trim() : value,
            ])
    );


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
        mostrarAlerta(err || 'Error desconocido', 'bg-red-500');
    }
});

