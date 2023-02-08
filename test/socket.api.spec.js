const { io } = require('socket.io-client');
const getAllTokens = require("./getTokens.spec")




async function probeSocketAPIRoutes(){
    const {tokenUser, tokenAdmin, badToken } = await getAllTokens()
    const tokens= [{tName: "no token", token: null, expect: [false, false, false]}, 
                    {tName: "bad token" , token: badToken, expect: [false, false, false]},
                    {tName: "user token", token: tokenUser, expect: [true, true, true]},
                    {tName: "admin token", token: tokenAdmin, expect: [true, true, true]}]


    const extensions = ['', 'audio', 'text']
    const endpoints = [
        'http://localhost:3000/',
        'http://localhost:3000/audio',
        'http://localhost:3000/text'
      ]
      
    console.log("probeSocketAPIRoutes: 3x endpoints (/, /text, /audio) and 4x tokens (none, bad, user, admin)")
    endpoints.forEach((endpoint, index) => {
        tokens.forEach(tokenObj => {
            let result
            const socket = io.connect(endpoint, {auth: {token: tokenObj.token || null}})
            socket.on("connect", () => {
                result = '🟩' 
                console.log(`    (accessExpected) ${tokenObj.expect[index] ? '🟩' :  '🟥' } ${result} (result) ${tokenObj.tName} ext: /${extensions[index]}`)
                socket.disconnect()
            })
            socket.on("connect_error", () => {
                result = '🟥'
                console.log(`    (accessExpected) ${tokenObj.expect[index] ? '🟩' :  '🟥' } ${result} (result) ${tokenObj.tName} ext: /${extensions[index]}`)
                socket.disconnect()
            })
            socket.on("error", () => {
                result = '🟥'
                console.log(`    (accessExpected) ${tokenObj.expect[index] ? '🟩' :  '🟥' } ${result} (result) ${tokenObj.tName} ext: /${extensions[index]}`)
                socket.disconnect()
            })
        })
    })
}

if (require.main === module){
    probeSocketAPIRoutes()
}

module.exports = probeSocketAPIRoutes


