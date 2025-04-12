const express = require('express');
const router = express.Router();
const qrController = require('../controllers/qrController')

router.post('/registrar', async (req, res) => {
  qrController.qrCreate(req,res)
});

module.exports = router;