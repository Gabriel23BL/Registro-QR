const express = require('express');
const QRCode = require('qrcode');
const router = express.Router();

// Arreglo para almacenar los registros en memoria
let registros = [];

// Ruta para registrar un nuevo registro
router.post('/registrar', (req, res) => {
    const { id, nombre, descripcion, departamento } = req.body;
    const registro = { id, nombre, descripcion, departamento };
    registros.push(registro); // Agregar el nuevo registro al arreglo

    // Generar el código QR
    const qrData = JSON.stringify(registro);
    QRCode.toDataURL(qrData, (err, url) => {
        if (err) return res.status(500).send(err);
        // Redirigir a la página de información con el ID del registro
        res.redirect(`/informacion?id=${id}`);
    });
});

// Ruta principal que renderiza la vista de inicio
router.get('/', (req, res) => {
    res.render('index', { nombre: 'Ricardo' });
});

// Ruta para obtener la información de un registro específico
router.get('/informacion', async (req, res) => {
    const registro = registros.find(r => r.id === req.query.id);
    if (registro) {
        // Generar el código QR para el registro
        const qrData = `http://localhost:3000/informacion?id=${registro.id}`; // URL para el código QR
        const qrCodeURL = await QRCode.toDataURL(qrData); // Generar el código QR

        // Renderizar la vista con los datos del registro y el código QR
        res.send(`
            <h1>Información del Registro</h1>
            <p>ID: ${registro.id}</p>
            <p>Nombre: ${registro.nombre}</p>
            <p>Descripción: ${registro.descripcion}</p>
            <p>Departamento: ${registro.departamento}</p>
            <h2>Código QR</h2>
            <img src="${qrCodeURL}" alt="Código QR" style="width: 100px; height: 100px;">
        `);
    } else {
        res.send('<h1>Registro no encontrado</h1>');
    }
});

// Nueva ruta para obtener todos los registros y mostrarlos en una tabla
router.get('/registros', async (req, res) => {
    let tablaHTML = `
        <h1>Lista de Registros</h1>
        <table border="1">
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Departamento</th>
                <th>Código QR</th>
            </tr>
    `;

    // Iterar sobre todos los registros y generar filas para la tabla
    for (const registro of registros) {
        const qrData = `http://localhost:3000/informacion?id=${registro.id}`; // URL para el código QR
        const qrCodeURL = await QRCode.toDataURL(qrData); // Generar el código QR
        tablaHTML += `
            <tr>
                <td>${registro.id}</td>
                <td>${registro.nombre}</td>
                <td>${registro.descripcion}</td>
                <td>${registro.departamento}</td>
                <td><img src="${qrCodeURL}" alt="Código QR" style="width: 100px; height: 100px;"></td>
            </tr>
        `;
    }

    tablaHTML += `</table>`;
    res.send(tablaHTML); // Enviar la tabla HTML como respuesta
});

module.exports = router;