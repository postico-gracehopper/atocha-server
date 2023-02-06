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
  
  // Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const mainFn = async () => {
    try {
        const usr = await signInWithEmailAndPassword(auth, process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD)
        console.log(console.log(usr))
        const token = await usr.user.getIdToken()
        console.log(token)
        const usrToken = usr._tokenResponse.idToken
        console.log(usrToken)
        axios.get("http://localhost:3000/api/checkDocker", {headers: {auth: usrToken}})
            .then(res => console.log(res.data))
            .catch(res => console.error(res.data))
    } catch(err){
        console.error(err)
    }
}

mainFn()