const { io } = require('socket.io-client');
const fs = require("fs")
const getAllTokens = require("./getTokens.spec")



const m4aReq = async () => {
    const tokens = await getAllTokens()
    const socket = io("http://127.0.0.1:3000/audio", {auth: {token: tokens.tokenUser}}); 
    socket.on("connect", () => {
        console.log("connected to socket server ")
        
        const testM4a = fs.readFileSync('/Users/blakebequette/fullstack/atocha/atocha-server/test/sample.m4a', {encoding: 'base64'})

        socket.volatile.emit("audio", 

        {
            langSource: "en-US",
            langTarget: "es-ES",
            audioData: testM4a,
            fileFormat: "m4a"
        })
    })

    socket.on("partial-translation", (partialTranslation) => {
       console.log(`   Partial translation: ${partialTranslation.translation.slice(0,30)}`)
    })

    socket.on("final-translation", (finalTranslation) => {
            console.log('Received a final translation:')
            console.log(finalTranslation.translation)
    })

    socket.on("partial-transcription", (partialTranscription) => {
       console.log(`   Partial transcription: ${partialTranscription}`)
    })

    socket.on("final-transcription", (finalTranscription) => {
        console.log('Received a final transcription:')
        console.log(finalTranscription)
    })


    socket.on("connect_error", (err) => {
        console.log(err.message)
    })

    setTimeout(() => socket.close(), 10000)
}


if (require.main === module){
    setTimeout(m4aReq, 1000)
}

module.exports = m4aReq