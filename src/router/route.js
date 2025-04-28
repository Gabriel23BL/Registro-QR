import { Router } from "express";
import { ControladorProducto } from "../Controller/ControllerProducto.js";
export const rutas = Router();
const controlador = new ControladorProducto();

rutas.get("/", async (req, res) => {
  await controlador.listar(req, res);
});

rutas.post('/registrar', async (req, res) => {
  await controlador.crear(req, res);
}
);
rutas.post('/registrar/:registro_id/update', async (req, res) => {
  await controlador.actualizar(req, res);
});

rutas.post('/registrar/:registro_id/delete', async (req, res) => {
  await controlador.eliminar(req, res);
}
);

rutas.get('/registros/:id', async (req, res) => {
  await controlador.listarporId(req, res);
});

rutas.post('/pdf', async (req, res) => {
  await controlador.generatePDF(req, res);
});
