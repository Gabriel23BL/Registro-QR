const express = require('express');
const router = express.Router();  
const indexController = require('../controllers/indexController');

router.get('/', async (req,res) => { 
    indexController.mostrarRegistros(req,res);
});

module.exports = router;