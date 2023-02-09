const { getAuth } = require('firebase-admin/auth')


async function checkForGoogleIDToken(clientSocket, next){
    try {
      const { token } = clientSocket?.handshake?.auth
      if (!token) throw new Error("No token provided")
      const uid = await getAuth().verifyIdToken(token)
      clientSocket.user = uid
      next()
    } catch(err){
      err.status = err.status || 404
      err.message = err.message || "Could not verify user: please include {auth: {token: <GoogleIDTokenString>}} in future request"
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