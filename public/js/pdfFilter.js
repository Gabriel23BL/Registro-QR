function generatePDF() {
    const registrosVisibles = [];
    document.querySelectorAll('.registrosContainer tbody tr:not([style*="display: none"])').forEach(row => {
        const cells = row.cells;
        registrosVisibles.push({
            id: cells[0].textContent.trim(),
            nombre: cells[1].textContent.trim(),
            descripcion: cells[2].textContent.trim(),
            departamento: cells[3].textContent.trim(),
            qrUrl: row.querySelector('.imgQr').src
        });
    });

    fetch('/pdf', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ registros: registrosVisibles }),
    })
    .then(response => response.blob())
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'registros_actuales.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
    })
    .catch(error => console.error('Error:', error));
}