const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore  } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth')


// const serviceAccount = require('../firebaseConfig.json');
const serviceAccount = JSON.parse(process.env.FIRE_BASE_CONFIG_JSON);

initializeApp({
  credential: cert(serviceAccount), 
});

const db = getFirestore();


module.exports = { db, getAuth }


