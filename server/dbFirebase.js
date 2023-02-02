
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

// const serviceAccount = require('./path/to/serviceAccountKey.json');
const serviceAccount = require('../firebaseConfig.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();


module.exports = db


