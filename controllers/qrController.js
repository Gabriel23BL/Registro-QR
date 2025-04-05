const express = require('express');
const QRCode = require('qrcode');
const router = express.Router();
const PDFDocument = require('pdfkit');
const qr = require('qr-image');

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
    res.render('informacion');
});

const testData = [
    {
      id: 'EMP-001',
      nombre: 'Juan Pérez',
      descripcion: 'Desarrollador Frontend',
      departamento: 'Tecnología'
    },
    {
      id: 'EMP-002',
      nombre: 'María García',
      descripcion: 'Diseñadora UX/UI',
      departamento: 'Diseño'
    },
    {
      id: 'EMP-003',
      nombre: 'Carlos López',
      descripcion: 'Gerente de Proyectos',
      departamento: 'Gestión'
    },
    {
      id: 'EMP-004',
      nombre: 'Ana Martínez',
      descripcion: 'Especialista en Marketing',
      departamento: 'Marketing'
    },
    {
      id: 'EMP-004',
      nombre: 'Ana Martínez',
      descripcion: 'Especialista en Marketing',
      departamento: 'Marketing'
    },
    {
      id: 'EMP-004',
      nombre: 'Ana Martínez',
      descripcion: 'Especialista en Marketing',
      departamento: 'Marketing'
    },
    {
      id: 'EMP-004',
      nombre: 'Ana Martínez',
      descripcion: 'Especialista en Marketing',
      departamento: 'Marketing'
    },
    {
      id: 'EMP-004',
      nombre: 'Ana Martínez',
      descripcion: 'Especialista en Marketing',
      departamento: 'Marketing'
    },
    {
      id: 'EMP-004',
      nombre: 'Ana Martínez',
      descripcion: 'Especialista en Marketing',
      departamento: 'Marketing'
    },
    {
      id: 'EMP-004',
      nombre: 'Ana Martínez',
      descripcion: 'Especialista en Marketing',
      departamento: 'Marketing'
    },
    {
      id: 'EMP-004',
      nombre: 'Ana Martínez',
      descripcion: 'Especialista en Marketing',
      departamento: 'Marketing'
    },
    {
      id: 'EMP-004',
      nombre: 'Ana Martínez',
      descripcion: 'Especialista en Marketing',
      departamento: 'Marketing'
    },
    {
      id: 'EMP-004',
      nombre: 'Ana Martínez',
      descripcion: 'Especialista en Marketing',
      departamento: 'Marketing'
    },
    {
      id: 'EMP-004',
      nombre: 'Ana Martínez',
      descripcion: 'Especialista en Marketing',
      departamento: 'Marketing'
    },
    {
      id: 'EMP-004',
      nombre: 'Ana Martínez',
      descripcion: 'Especialista en Marketing',
      departamento: 'Marketing'
    },
    {
      id: 'EMP-004',
      nombre: 'Ana Martínez',
      descripcion: 'Especialista en Marketing',
      departamento: 'Marketing'
    },
    {
      id: 'EMP-004',
      nombre: 'Ana Martínez',
      descripcion: 'Especialista en Marketing',
      departamento: 'Marketing'
    },
    {
      id: 'EMP-004',
      nombre: 'Ana Martínez',
      descripcion: 'Especialista en Marketing',
      departamento: 'Marketing'
    },
    {
      id: 'EMP-004',
      nombre: 'Ana Martínez',
      descripcion: 'Especialista en Marketing',
      departamento: 'Marketing'
    },
    {
      id: 'EMP-004',
      nombre: 'Ana Martínez',
      descripcion: 'Especialista en Marketing',
      departamento: 'Marketing'
    },
    {
      id: 'EMP-004',
      nombre: 'Ana Martínez',
      descripcion: 'Especialista en Marketing',
      departamento: 'Marketing'
    },
    {
      id: 'EMP-004',
      nombre: 'Ana Martínez',
      descripcion: 'Especialista en Marketing',
      departamento: 'Marketing'
    }
  ];
  
  // Ruta para generar el PDF
  // Ruta para generar el PDF
  router.get('/pdf', async (req, res) => {
    try {
      const doc = new PDFDocument({ margin: 20, size: 'A4' });
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=datos.pdf');
      doc.pipe(res);
  
      // Configuración compacta
      const tableConfig = {
        columnWidths: [70, 110, 170, 95, 55], // Ajuste de anchos
        padding: 1,  // Reducción de espacio entre columnas
        rowHeight: 40,  // Altura reducida de filas
        bodyFontSize: 9,  // Texto más pequeño
        leftMargin: 20, // Margen izquierdo reducido

      };
  
      // Calcular posición inicial
      const totalWidth = tableConfig.columnWidths.reduce((a, b) => a + b, 0) + 
                        (tableConfig.padding * (tableConfig.columnWidths.length - 1));
      const tableStartX = (doc.page.width - totalWidth) / 2;
  
      let yPosition = doc.page.margins.top; // Comienza desde el margen superior
  
      // Verificación de espacio ajustada
      const checkSpace = () => {
        if (yPosition + tableConfig.rowHeight > doc.page.height - 20) { // Margen inferior reducido
          doc.addPage();
          yPosition = 20; // Menor espacio superior en nuevas páginas
        }
      };
  
      // Generar contenido directo
      for (const item of testData) {
        checkSpace();
        let xPosition = tableStartX;
  
        [0, 1, 2, 3, 4].forEach(index => { // Índices directos
          let content;
          switch(index) {
            case 0: content = item.id; break;
            case 1: content = item.nombre; break;
            case 2: content = item.descripcion; break;
            case 3: content = item.departamento; break;
            case 4: content = qr.imageSync(item.id, { type: 'png' }); break;
          }
  
          if (content instanceof Buffer) {
            doc.image(content, xPosition - 6  , yPosition - 6, { 
              width: 30,
              height: 30
            });
          } else {
            doc.fontSize(tableConfig.bodyFontSize)
               .text(content, xPosition + 2, yPosition + 5, {
                  width: tableConfig.columnWidths[index] - 4,
                  align: 'left',
                  lineBreak: false,
                  ellipsis: true,
                  height: tableConfig.rowHeight - 5
               });
          }
  
          xPosition += tableConfig.columnWidths[index] + tableConfig.padding;
        });
  
        yPosition += tableConfig.rowHeight;
      }
  
      doc.end();
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Error generando documento');
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