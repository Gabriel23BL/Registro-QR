const express = require('express');
const QRCode = require('qrcode');
const { getDocs, collection } = require('firebase/firestore');
const db = require('./dbController'); // Asegúrate de que la ruta sea correcta

const router = express.Router();

router.get('/registros', async (req, res) => {
  try {
    const querySnapshot = await getDocs(collection(db, 'registrosQr'));
    const registros = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

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

    for (const registro of registros) {
      const qrData = `http://localhost:3000/informacion?id=${registro.id}`;
      const qrCodeURL = await QRCode.toDataURL(qrData);
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
    res.send(tablaHTML);
  } catch (error) {
    console.error('Error al obtener registros:', error);
    res.status(500).send('Error al cargar los registros');
  }
});

module.exports = router;