import { Router } from "express";
import { ControladorRegistro } from "../Controller/ControllerRegistro.js";
import { ControladorUsuario } from "../Controller/ControllerUsuario.js";
import { ControladorAuditoria } from "../Controller/ControllerAuditoria.js";
import { ControladorDepartamento } from "../Controller/ControllerDepartamento.js";
import { authenticateJWT, authenticateJWTLogin, checkRole } from "../middlewares/authMiddleware.js";

/*Creacion de las variables con los objetos de las clases de los controladores*/
export const rutas = Router();
const controlador = new ControladorRegistro();
const controladorUsuario = new ControladorUsuario();
const controladorAuditoria = new ControladorAuditoria();
const controladorDepartamento = new ControladorDepartamento();


rutas.get("/", authenticateJWT, async (req, res) => {
  await controlador.listar(req, res);
});

rutas.get("/usuarios", authenticateJWT, checkRole(['Administrador']), async (req, res) => {
  await controladorUsuario.mostrarUsuarios(req, res);
}
);

rutas.post("/usuarios/agregar", authenticateJWT, checkRole(['Administrador']), async (req, res) => {
  await controladorUsuario.agregarUsuario(req, res);
}
);

rutas.get("/auditoria", authenticateJWT, checkRole(['Administrador']), async (req, res) => {
  await controladorAuditoria.mostrarAuditoria(req, res);
}
);

rutas.get('/departamentos', authenticateJWT, checkRole(['Administrador']), async (req, res) => {
  await controladorDepartamento.mostrarDepartamentos(req,res)
});

rutas.post('/departametos/agregar', authenticateJWT, checkRole(['Administrador']), async (req, res) => {
  await controladorDepartamento.agregarDepartamento(req,res)
}
);

rutas.post('/departamentos/update/:id', authenticateJWT, checkRole(['Administrador']), async (req, res) => {
  await controladorDepartamento.editarDepartamento(req,res)
}
);

rutas.post('/departamentos/delete/:id', authenticateJWT, checkRole(['Administrador']), async (req, res) => {
  await controladorDepartamento.eliminarDepartamento(req,res)
}
);



rutas.post('/departamentos/agregar', authenticateJWT, checkRole(['Administrador']), async (req, res) => {
  await controladorDepartamento.agregarDepartamento(req,res)
}
);

rutas.post("/usuario/update/:id", authenticateJWT, checkRole(['Administrador']), async (req, res) => {
  await controladorUsuario.actualizarUsuario(req, res);
}
);

rutas.post('/usuarios/eliminar/:id', authenticateJWT, checkRole(['Administrador']), async (req, res) => {
  await controladorUsuario.eliminarUsuario(req, res);
})

rutas.post('/registrar', authenticateJWT, async (req, res) => {
  await controlador.crear(req, res);
}
);

rutas.post('/registrar/:registro_id/update', authenticateJWT, async (req, res) => {
  await controlador.actualizar(req, res);
});

rutas.post('/registrar/:registro_id/delete', authenticateJWT, async (req, res) => {
  await controlador.eliminar(req, res);
}
);

rutas.get('/logout', authenticateJWT, async (req, res) => {
  await controladorUsuario.logout(req, res);
});


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


