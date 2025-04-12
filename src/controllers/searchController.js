
const { getRegistrosPorDepartamento } = require('./dbController');

exports.searchController = async (req, res) => {
    const registro = await getRegistrosPorDepartamento();
    if(registro.length > 0){
        
    }
};