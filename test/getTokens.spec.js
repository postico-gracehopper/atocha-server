require("dotenv").config()
const { initializeApp } = require("firebase/app")
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth")
const axios = require('axios')


const firebaseConfig = {
    apiKey: "AIzaSyAejNhTxIKa7Rb_T7hFzA7WS8fiEIKl3F4",
    authDomain: "atocha-c5fca.firebaseapp.com",
    projectId: "atocha-c5fca",
    storageBucket: "atocha-c5fca.appspot.com",
    messagingSenderId: "984464714627",
    appId: "1:984464714627:web:dabeb9e4b91809d16e24b6",
    measurementId: "G-LL6P26GZQ8"
  };
  
//   const socket = io({
//     auth: {
//       token: "abc"
//     }
//   });
  // Initialize Firebase
  
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const BAD_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.dyt0CoTl4WoVjAHI9Q_CwSKhl6d_9rhM3NrXuJttkao"

const getTokenAdmin = async () => {
  try {
      const usr = await signInWithEmailAndPassword(auth, process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD)
      return usr._tokenResponse.idToken
  } catch(err){
      console.error(err)
      throw new Error("Could not get Admin token")
  }
}

const getTokenUser = async () => {
  try {
      const usr = await signInWithEmailAndPassword(auth, process.env.USER_EMAIL, process.env.USER_PASSWORD)
      return usr._tokenResponse.idToken
  } catch(err){
      console.error(err)
      throw new Error("Could not get USER token")
  }
}





function getAllTokens(){
  return new Promise((resolve, reject) => {
    Promise.all([
      getTokenAdmin(),
      getTokenUser(),
  
    ]).then(([tokenAdmin, tokenUser]) => {
      const tokenObj = {
        tokenAdmin,
        tokenUser,
        tokenBad: BAD_TOKEN
      }
      resolve(tokenObj)
    })
    .catch(err => {
      console.error(err)
      reject(err)
    })
  })
}


if (require.main === module){
  getAllTokens().then(result => console.log(result)).catch(console.error)
}

module.exports = getAllTokens