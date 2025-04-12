const { getDocs, collection, orderBy, query } = require('firebase/firestore');
const { db } = require('./dbController');

exports.mostrarRegistros = async (req, res) => {
   try {
    const q = query(
      collection(db, 'registrosQr'),
      orderBy('id')
    );
    
    const querySnapshot = await getDocs(q);
       const registros = querySnapshot.docs.map(doc => ({
         firestoreId: doc.id,
         ...doc.data()
       }));
       res.render('index', { registros: registros });
     } catch (error) {
       console.error('Error al obtener registros:', error);
       res.status(500).send('Error al cargar los registros');
     }
  };
    
