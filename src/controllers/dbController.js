const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyCggej80SD-IXKCYpyFucLMeJmdKBVYphs",
  authDomain: "qr-proyect-4cb56.firebaseapp.com",
  projectId: "qr-proyect-4cb56",
  storageBucket: "qr-proyect-4cb56.firebasestorage.app",
  messagingSenderId: "1070410469042",
  appId: "1:1070410469042:web:80866b82445223ce7583ab",
  measurementId: "G-9XKS6NNP8E"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const addRegistro = async (req, res) => {
  try {
    const { id, nombre, descripcion, departamento } = req.body;
    const docRef = await addDoc(collection(db, 'registrosQr'), {
      id,
      nombre,
      descripcion,
      departamento,
    });
    res.status(201).json({ id: docRef.id });
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

module.exports = {
  addRegistro,
  updateRegistro,
  deleteRegistro,
};