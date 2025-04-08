const express = require('express');
const { initializeApp } = require('firebase/app');
const QRCode = require('qrcode');
const router = express.Router();
const PDFDocument = require('pdfkit');
const qr = require('qr-image');
const { getFirestore, collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyCggej80SD-IXKCYpyFucLMeJmdKBVYphs",
  authDomain: "qr-proyect-4cb56.firebaseapp.com",
  projectId: "qr-proyect-4cb56",
  storageBucket: "qr-proyect-4cb56.firebasestorage.app",
  messagingSenderId: "1070410469042",
  appId: "1:1070410469042:web:80866b82445223ce7583ab",
  measurementId: "G-9XKS6NNP8E"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);



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

    res.redirect('/')
  } catch (error) {
    console.error('Error al crear registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


router.post('/registrar/:firestoreId/update', async (req, res) => {
  try {
    const { firestoreId } = req.params;
    const { id, nombre, descripcion, departamento } = req.body;

    const qrText = `ID: ${id}\nNombre: ${nombre}\nDescripción: ${descripcion}\nDepartamento: ${departamento}`;
    const qrUrl = await QRCode.toDataURL(qrText);

    const docRef = doc(db, 'registrosQr', firestoreId);
    await updateDoc(docRef, {
      id,
      nombre,
      descripcion,
      departamento,
      qrUrl
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error al actualizar:', error);
    res.status(500).json({ error: 'Error al actualizar' });
  }
});

router.post('/registrar/:firestoreId/delete', async (req, res) => {
  try {
    const { firestoreId } = req.params;
    await deleteDoc(doc(db, 'registrosQr', firestoreId));
    res.redirect('/');
  } catch (error) {
    console.error('Error al eliminar registro:', error);
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


router.get('/pdf', async (req, res) => {
  try {
    const querySnapshot = await getDocs(collection(db, 'registrosQr'));
    const registros = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const doc = new PDFDocument({ margin: 20, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=registros_qr.pdf');
    doc.pipe(res);

    // Configuración mejorada
    const tableConfig = {
      columnWidths: [80, 120, 180, 120, 100],
      padding: 2,
      rowHeight: 65,
      bodyFontSize: 10,
      headerFontSize: 8,
      borderWidth: 0.8,
      qrSize: 60,
      qrVerticalOffset: 0 // Nuevo ajuste para posición vertical
    };

    const totalWidth = tableConfig.columnWidths.reduce((a, b) => a + b, 0);
    const tableStartX = (doc.page.width - totalWidth) / 2;

    let yPosition = 40;

    // Función para dibujar bordes completos
    const drawCompleteBorders = (x, y, widths, rowHeight) => {
      doc.lineWidth(tableConfig.borderWidth);

      // Bordes exteriores
      doc.rect(x, y, totalWidth, rowHeight).stroke();

      // Bordes internos verticales
      let currentX = x;
      for (let i = 0; i < widths.length - 1; i++) {
        currentX += widths[i];
        doc.moveTo(currentX, y)
          .lineTo(currentX, y + rowHeight)
          .stroke();
      }
    };

    for (const registro of registros) {
      const qrText = `ID: ${registro.id}\nNombre: ${registro.nombre}\nDescripción: ${registro.descripcion}\nDepartamento: ${registro.departamento}`;

      const qrBuffer = await QRCode.toBuffer(qrText, {
        type: 'png',
        errorCorrectionLevel: 'H',
        width: tableConfig.qrSize * 8
      });

      drawCompleteBorders(tableStartX, yPosition, tableConfig.columnWidths, tableConfig.rowHeight);

      let xPosition = tableStartX;

      // Contenido de las celdas
      [
        { label: 'ID', value: registro.id },
        { label: 'Nombre', value: registro.nombre },
        { label: 'Descripción', value: registro.descripcion },
        { label: 'Departamento', value: registro.departamento },
        { label: 'QR', value: qrBuffer }
      ].forEach((field, index) => {
        // Encabezado de campo
        doc.fontSize(tableConfig.headerFontSize)
          .text(field.label, xPosition + 5, yPosition + 5, {
            width: tableConfig.columnWidths[index] - 10,
            align: 'left'
          });

        // Contenido principal
        if (field.label === 'QR') {
          const qrY = yPosition + (tableConfig.rowHeight / 2) - (tableConfig.qrSize / 2) - tableConfig.qrVerticalOffset;
          doc.image(field.value,
            xPosition + (tableConfig.columnWidths[index] - tableConfig.qrSize) / 2,
            qrY,
            { width: tableConfig.qrSize }
          );
        } else {
          doc.fontSize(tableConfig.bodyFontSize)
            .text(field.value.toString(),
              xPosition + 5,
              yPosition + 20, {
              width: tableConfig.columnWidths[index] - 10,
              align: 'left',
              ellipsis: true
            });
        }

        xPosition += tableConfig.columnWidths[index];
      });

      yPosition += tableConfig.rowHeight;

      if (yPosition > doc.page.height - 60) {
        doc.addPage();
        yPosition = 40;
      }
    }

    doc.end();
  } catch (error) {
    console.error('Error generando PDF:', error);
    res.status(500).send('Error generando documento PDF');
  }
});

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