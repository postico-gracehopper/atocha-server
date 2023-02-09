require("dotenv").config()
const { initializeApp } = require("firebase/app")
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth")


const firebaseConfig = require("../fireBaseClient.json")

const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const BAD_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.dyt0CoTl4WoVjAHI9Q_CwSKhl6d_9rhM3NrXuJttkao"

const getTokenAdmin = async () => {
  try {
      const usr = await signInWithEmailAndPassword(auth, process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD)
      console.log(JSON.stringify(usr))
      console.log(Object.keys(usr))
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
    console.log("GET TOKENS")
  getAllTokens().then(resultObj => {
    if (resultObj.tokenAdmin && typeof resultObj.tokenAdmin === 'string' && resultObj.tokenAdmin.length > 100) {
        console.log('    🟩', 'admin token')
    } else {
        console.log('    🟥', 'admin token')
    }
    if (resultObj.tokenUser && typeof resultObj.tokenUser === 'string' && resultObj.tokenUser.length > 100) {
        console.log('    🟩', 'user token')
    } else {
        console.log('    🟥', 'user token')
    }
    if (resultObj.tokenBad && typeof resultObj.tokenBad === 'string' && resultObj.tokenBad.length > 80) {
        console.log('    🟩', 'bad token')
    } else {
        console.log('    🟥', 'bad token')
    }
  }).catch(console.error)
}

module.exports = getAllTokens