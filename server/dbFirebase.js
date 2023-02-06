
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore  } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth')

// const serviceAccount = require('./path/to/serviceAccountKey.json');
const serviceAccount = require('../firebaseConfig.json');

const fireApp = initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

// const fireAuth = getAuth(fireApp)


module.exports = { db, getAuth }


