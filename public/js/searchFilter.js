document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchDepto');
    const clearButton = document.getElementById('clearSearch');
    const tableRows = document.querySelectorAll('.registrosContainer tbody tr');
    const filterRegistros = () => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        document.querySelectorAll('.registrosContainer tbody tr').forEach(row => {
            const departamento = row.cells[3].textContent.toLowerCase();
            if (departamento.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });

        clearButton.style.display = searchTerm.length > 0 ? 'block' : 'none';
    };

    searchInput.addEventListener('input', filterRegistros);
    clearButton.addEventListener('click', () => {
        searchInput.value = '';
        filterRegistros();
    });
    
});