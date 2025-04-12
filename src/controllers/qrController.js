const {addRegistro} = require('./dbController');

exports.qrCreate = async (req, res) => {
  addRegistro(req,res);
  res.redirect('/');
};

