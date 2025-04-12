const express = require('express');
const router = express.Router();
const db  = require('../controllers/dbController');

router.post('/registrar', db.addRegistro);
router.post('/registrar/:firestoreId/update', db.updateRegistro);
router.post('/registrar/:firestoreId/delete', db.deleteRegistro);

module.exports = router;