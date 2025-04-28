import { ModeloRegistro } from "../Model/ModeloRegistro.js";
import { validarCampos } from "../middlewares/validation.js";
import { obtenerIpServidor } from "../utils/ObtenerIpServidor.js";
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';

export class ControladorRegistro {
  async listar(req, res) {
    try {
      const registros = await ModeloRegistro.obtenerRegistros();
      res.render("index", {
        registros,
        nombre: req.user.nombre,
        email: req.user.email,
        rol: req.user.rol,
      });
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: error.message });
    }
  }

  async listarporId(req, res) {
    try {
      const { id } = req.params;
      const registro = await ModeloRegistro.buscarPorId(id);
      if (!registro) {
        return res.status(404).json({ error: 'Registro no encontrado' });
      }
      res.render('producto', { registro });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  async crear(req, res) {
    try {
      const { id, nombre, descripcion, departamento, status, observaciones, encargado } = req.body;
      validarCampos(id, nombre, descripcion, departamento, status, observaciones, encargado);
      const existeProducto = await ModeloRegistro.buscarPorId(id);
      if (existeProducto) {
        return res.status(400).json({ error: `El ID ${id} ya está registrado en otro registro.` });
      }
      // const qrText = `${req.protocol}://${req.get('host')}/registros/${id}`;
      const ipServidor = await obtenerIpServidor();
      const qrText = `http://${ipServidor}:${3000}/registros/${id}`;
      const qrUrl = await QRCode.toDataURL(qrText);

      await ModeloRegistro.crearRegistro(req.body, qrUrl);
      res.status(200).json({ message: 'Registro creado correctamente.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }


  async actualizar(req, res) {
    try {
      const { registro_id } = req.params;
      const { id, nombre, descripcion, departamento, estado, observaciones, encargado } = req.body;
      validarCampos(id, nombre, descripcion, departamento, estado, observaciones, encargado);
      const existeProducto = await ModeloRegistro.buscarPorId(id);

      if (existeProducto && String(existeProducto.registro_id) !== registro_id) {
        return res.status(400).json({ error: `El ID ${id} ya está registrado en otro registro.` });
      }

      const ipServidor = await obtenerIpServidor();
      const qrText = `http://${ipServidor}:${3000}/registros/${id}`;
      const qrUrl = await QRCode.toDataURL(qrText);
      await ModeloRegistro.actualizarRegistro(registro_id, qrUrl, req.body);
      res.status(200).json({ message: 'Registro actualizado correctamente.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }


  async eliminar(req, res) {
    try {
      const { registro_id } = req.params;
      await ModeloRegistro.eliminarRegistro(registro_id);
      res.status(200).json({ message: 'Registro eliminado correctamente.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }


  async generatePDF(req, res) {
    try {
      const { registros } = req.body;
      const doc = new PDFDocument({ margin: 20, size: 'A4' });
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=registros_qr.pdf');
      doc.pipe(res);

      const tableConfig = {
        columnWidths: [80, 120, 180, 120, 100],
        padding: 2,
        rowHeight: 65,
        bodyFontSize: 10,
        headerFontSize: 8,
        borderWidth: 0.8,
        qrSize: 60,
        qrVerticalOffset: 0
      };

      const totalWidth = tableConfig.columnWidths.reduce((a, b) => a + b, 0);
      const tableStartX = (doc.page.width - totalWidth) / 2;

      let yPosition = 40;

      const drawCompleteBorders = (x, y, widths, rowHeight) => {
        doc.lineWidth(tableConfig.borderWidth);
        doc.rect(x, y, totalWidth, rowHeight).stroke();

        let currentX = x;
        for (let i = 0; i < widths.length - 1; i++) {
          currentX += widths[i];
          doc.moveTo(currentX, y)
            .lineTo(currentX, y + rowHeight)
            .stroke();
        }
      };

      const ipServidor = await obtenerIpServidor();
      for (const registro of registros) {
        const qrText = `http://${ipServidor}:${3000}/registros/${registro.id}`;
        const qrBuffer = await QRCode.toBuffer(qrText, {
          type: 'png',
          errorCorrectionLevel: 'H',
          width: tableConfig.qrSize * 8
        });

        drawCompleteBorders(tableStartX, yPosition, tableConfig.columnWidths, tableConfig.rowHeight);
        let xPosition = tableStartX;
        [
          { label: 'ID', value: registro.id },
          { label: 'Nombre', value: registro.nombre },
          { label: 'Descripción', value: registro.descripcion },
          { label: 'Departamento', value: registro.departamento },
          { label: 'QR', value: qrBuffer }
        ].forEach((field, index) => {
          doc.fontSize(tableConfig.headerFontSize)
            .text(field.label, xPosition + 5, yPosition + 5, {
              width: tableConfig.columnWidths[index] - 10,
              align: 'left'
            });

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
  };

};


