const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');

router.post('/pdf', pdfController.generatePDF);
module.exports = router;