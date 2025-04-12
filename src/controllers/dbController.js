const { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } = require('firebase/firestore');
const { db } = require('../models/dbModels');
const QRCode = require('qrcode');


const addRegistro = async (req, res) => {
  try {
    const { id, nombre, descripcion, departamento } = req.body;
    const qrText = `ID: ${id}\nNombre: ${nombre}\nDescripción: ${descripcion}\nDepartamento: ${departamento}`;
    const qrUrl = await QRCode.toDataURL(qrText);
    const docRef = await addDoc(collection(db, 'registrosQr'), {
      id,
      nombre,
      descripcion,
      departamento,
      qrUrl
    });
  } catch (error) {
    console.error('Error al agregar registro:', error);
    res.status(500).json({ error: 'Error al agregar registro' });
  }
};

const updateRegistro = async (req, res) => {
  try {
    const { firestoreId } = req.params;
    const { id, nombre, descripcion, departamento } = req.body;

    const docRef = doc(db, 'registrosQr', firestoreId);
    await updateDoc(docRef, {
      id,
      nombre,
      descripcion,
      departamento,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error al actualizar registro:', error);
    res.status(500).json({ error: 'Error al actualizar registro' });
  }
};

const deleteRegistro = async (req, res) => {
  try {
    const { firestoreId } = req.params;
    await deleteDoc(doc(db, 'registrosQr', firestoreId));
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar registro:', error);
    res.status(500).json({ error: 'Error al eliminar registro' });
  }
};

const getRegistrosQr = async () => {
  try {
    const q = query(
      collection(db, 'registrosQr'),
      orderBy('id')
    );

    const querySnapshot = await getDocs(q);
    return registros = querySnapshot.docs.map(doc => ({
      firestoreId: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching registrosQr: ", error);
    throw error;
  }
};

async function getRegistrosPorDepartamento(departamento) {
  try {
    const q = query(
      collection(db, 'registrosQr'),
      where('departamento', '==', departamento),
      orderBy('id', 'asc')
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error al obtener registros: ", error);
    throw error;
  }
}


module.exports = {
  addRegistro,
  updateRegistro,
  deleteRegistro,
  getRegistrosQr,
  getRegistrosPorDepartamento
};