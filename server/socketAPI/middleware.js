const { getAuth } = require('firebase-admin/auth')


async function checkForGoogleIDToken(clientSocket, next){
    try {
      const { token } = clientSocket?.handshake?.auth
      const uid = await getAuth().verifyIdToken(token)
      clientSocket.user = uid
      next()
    } catch(err){
      err.status = 404
      err.message = "Socket connection error: user could not be verified through Google Firebase"
      next(err)
    }
  }
  
  function loggingMiddleware(clientSocket, next) {
    console.log(`socket - dest: ${clientSocket.adapter.nsp.name}, user: ${clientSocket.user.email}`)
    next()
    // Example of sending back an error
    // const e = new Error("thats not allowed")
    // next(e)
  }

  module.exports = {
    logger: loggingMiddleware,
    checkForGoogleIDToken,
  }