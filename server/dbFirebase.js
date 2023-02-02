// const Firestore = require('@google-cloud/firestore')

// const db = new Firestore({
//   projectId: 'atocha-c5fca',
//   keyFilename: './fireBaseConfig.json',
// })

// const docRef = db.collection('users').doc('alovelace');

// docRef.set({
//   first: 'Ada',
//   last: 'Lovelace',
//   born: 1815
// });

// module.exports = db


const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

// const serviceAccount = require('./path/to/serviceAccountKey.json');
const serviceAccount = require('../firebaseConfig.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();


module.exports = db


