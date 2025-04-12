const express = require('express');
const router = express.Router();
const actionsDbController = require('../controllers/dbController');

router.post('/registrar', actionsDbController.addRegistro);
router.post('/registrar/:firestoreId/update', actionsDbController.updateRegistro);
router.post('/registrar/:firestoreId/delete', actionsDbController.deleteRegistro);

module.exports = router;