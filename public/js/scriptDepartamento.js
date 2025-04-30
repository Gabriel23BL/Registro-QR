
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


let currentDepartamentoIdToDelete = null;

function openAddDepartamentoModal() {
    document.getElementById('addDepartamentoModal').classList.remove('hidden');
}

function closeAddDepartamentoModal() {
    document.getElementById('addDepartamentoModal').classList.add('hidden');
}

function openEditDepartamentoModal(id, nombre) {
    document.getElementById('editDepartamentoId').value = id;
    document.getElementById('editDepartamentoNombre').value = nombre;
    document.getElementById('editDepartamentoModal').classList.remove('hidden');
}

function closeEditDepartamentoModal() {
    document.getElementById('editDepartamentoModal').classList.add('hidden');
}

function openDeleteDepartamentoModal(id, nombre) {
    currentDepartamentoIdToDelete = id;
    document.getElementById('deleteDepartamentoName').textContent = nombre;
    document.getElementById('deleteDepartamentoModal').classList.remove('hidden');
}

function closeDeleteDepartamentoModal() {
    document.getElementById('deleteDepartamentoModal').classList.add('hidden');
    currentDepartamentoIdToDelete = null;
}


async function confirmDeleteDepartamento() {
try {

  const res = await fetch(`/departamentos/delete/${currentDepartamentoIdToDelete}`, { method: 'POST' });
  const result = await res.json();
  if (!res.ok) throw result;
  mostrarAlerta(result.message, 'bg-red-500');
  setTimeout(() => window.location.reload(), 1000);

} catch (err) {
  mostrarAlerta(err.error || 'Error desconocido', 'bg-red-500');
}
}

document.getElementById('addDepartamentoForm').addEventListener('submit', async function (e) {
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

document.getElementById('editDepartamentoForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const id = formData.get('id');
    const url = `/departamentos/update/${id}`;
    const data = Object.fromEntries(
        Array.from(new FormData(e.target))
            .map(([key, value]) => [
                key,
                typeof value === 'string' ? value.trim() : value
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

