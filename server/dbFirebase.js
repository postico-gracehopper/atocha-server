const {
  initializeApp,
  applicationDefault,
  cert,
} = require('firebase-admin/app');
const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require('firebase-admin/firestore');
require('dotenv').config();

const serviceAccount = require('../firebaseConfig.json');
// const serviceAccount = JSON.parse(process.env.FIRE_BASE_CONFIG_JSON);

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

module.exports = db;
