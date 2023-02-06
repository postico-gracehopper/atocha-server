
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore  } = require('firebase-admin/firestore');
const { auth } = require('firebase-admin/auth')
// const serviceAccount = require('./path/to/serviceAccountKey.json');
const serviceAccount = require('../firebaseConfig.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();


module.exports = { db, auth }


