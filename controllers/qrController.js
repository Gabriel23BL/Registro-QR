const express = require('express');
const QRCode = require('qrcode');
const app = express();
let registros = [];

app.post('/registrar', (req, res) => {
    const { id, nombre, descripcion, departamento } = req.body;
    const registro = { id, nombre, descripcion, departamento };
    registros.push(registro);
    const qrData = JSON.stringify(registro);
    QRCode.toDataURL(qrData, (err, url) => {
        if (err) return res.status(500).send(err);
        res.send(`<h1>Registro Exitoso</h1><img src="${url}"><p>Escanea el código QR para ver la información.</p>`);
        console.log('Qr: ', url)
    });
});

app.get('/', (req, res) => {
    res.render('index');
})

app.get('/info', (req, res) => {
    const registro = registros.find(r => r.id === req.query.id);
    if (registro) {
        res.send(`
            <h1>Información del Registro</h1>
            <p>ID: ${registro.id}</p>
            <p>Nombre: ${registro.nombre}</p>
            <p>Descripción: ${registro.descripcion}</p>
            <p>Departamento: ${registro.departamento}</p>
        `);
    } else {
        res.send('<h1>Registro no encontrado</h1>');
    }
});

module.exports = app;