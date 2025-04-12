const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');

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

module.exports = { db }
