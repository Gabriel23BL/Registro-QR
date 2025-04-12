const express = require('express');
const QRCode = require('qrcode');
const { addDoc, collection, getDocs } = require('firebase/firestore');
const db = require('./dbController'); // Importar el controlador de base de datos

const router = express.Router();

router.post('/registrar', async (req, res) => {
  try {
    const { id, nombre, descripcion, departamento } = req.body;
    const qrText = `ID: ${id}\nNombre: ${nombre}\nDescripción: ${descripcion}\nDepartamento: ${departamento}`;
    const qrUrl = await QRCode.toDataURL(qrText);
    const docRef = await addDoc(collection(db, 'registrosQr'), {
      id,
      nombre,
      descripcion,
      departamento,
      qrUrl,
    });

    res.redirect('/');
  } catch (error) {
    console.error('Error al crear registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/', async (req, res) => {
  try {
    const querySnapshot = await getDocs(collection(db, 'registrosQr'));
    const registros = querySnapshot.docs.map(doc => ({
      firestoreId: doc.id,
      ...doc.data()
    }));

    res.render('index', { registros: registros });
  } catch (error) {
    console.error('Error al obtener registros:', error);
    res.status(500).send('Error al cargar los registros');
  }
});

router.get('/informacion', async (req, res) => {
  res.render('informacion');
});

module.exports = router;