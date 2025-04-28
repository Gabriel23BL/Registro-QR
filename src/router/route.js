import { Router } from "express";
import { ControladorRegistro } from "../Controller/ControllerRegistro.js";
import { ControladorUsuario } from "../Controller/ControllerUsuario.js";
import { authenticateJWT, authenticateJWTLogin, checkRole } from "../middlewares/authMiddleware.js";
export const rutas = Router();
const controlador = new ControladorRegistro();
const controladorUsuario = new ControladorUsuario();

rutas.get("/", authenticateJWT, async (req, res) => {
  await controlador.listar(req, res);
});

rutas.post('/registrar', authenticateJWT, checkRole(['Administrador']), async (req, res) => {
  await controlador.crear(req, res);
}
);

rutas.post('/registrar/:registro_id/update', authenticateJWT, checkRole(['Administrador']), async (req, res) => {
  await controlador.actualizar(req, res);
});


rutas.post('/registrar/:registro_id/delete', authenticateJWT,  checkRole(['Administrador']), async (req, res) => {
  await controlador.eliminar(req, res);
}
);

rutas.get('/registros/:id', async (req, res) => {
  await controlador.listarporId(req, res);
});

rutas.get('/login', authenticateJWTLogin,  async (req,res) => {
  res.render('login');
}
);
rutas.post('/login', authenticateJWTLogin, async (req, res) => {
  await controladorUsuario.login(req, res);
});

rutas.post('/pdf', async (req, res) => {
  await controlador.generatePDF(req, res);
});
