const { getRegistrosQr } = require('./dbController');

exports.mostrarRegistros = async (req, res) => {
   try {
       const registros = await getRegistrosQr()
       res.render('index', { registros: registros });
     } catch (error) {
       console.error('Error al obtener registros:', error);
       res.status(500).send('Error al cargar los registros');
     }
  };
    
