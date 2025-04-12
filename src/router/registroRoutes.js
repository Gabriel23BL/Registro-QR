const express = require('express');
const router = express.Router();
const registroController = require('../controllers/registroContrller');

router.get('/registros', registroController.mostrarRegistros);

module.exports = router;