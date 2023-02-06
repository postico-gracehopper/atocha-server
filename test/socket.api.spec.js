const { io } = require('socket.io-client');
const getAllTokens = require("./getTokens.spec")




async function probeSocketAPIRoutes(){
    const serverBasePath = "http://localhost:3000/"
    const {tokenUser, tokenAdmin, badToken } = await getAllTokens()
    const tokens= [{tName: "no token", token: null, expect: [false, false, false]}, 
                    {tName: "bad token" , token: badToken, expect: [false, false, false]},
                    {tName: "user token", token: tokenUser, expect: [true, true, true]},
                    {tName: "admin token", token: tokenAdmin, expect: [true, true, true]}]


    const extensions = ['', 'audio', 'text']
    const endpoints = extensions.map(ext => serverBasePath + ext)
    endpoints.forEach((endpoint, index) => {
        tokens.forEach(tokenObj => {
            let result
            const socket = io(endpoint, {auth: {token: tokenObj.token}})
            socket.on("connect", () => {
                result = '🟩' 
                console.log(`    (accessExpected) ${tokenObj.expect[index] ? '🟩' :  '🟥' } ${result} (result) ${tokenObj.tName} ext:${extensions[index]}`)
                socket.disconnect()
            })
            socket.on("connect_error", () => {
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


