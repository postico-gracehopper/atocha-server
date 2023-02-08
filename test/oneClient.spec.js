const { io } = require('socket.io-client');
const fs = require("fs")
const getAllTokens = require("./getTokens.spec")



const m4aReq = async (detailLog=false, socketName="") => {
    const socketLabel = socketName === "" ? String(Math.random()*10000).slice(0,4) : socketName
    const tokens = await getAllTokens()
    const socket = io("http://127.0.0.1:3000/audio", {auth: {token: tokens.tokenUser}}); 
    socket.on("connect", () => {
        console.log(`s:${socketLabel} is connected to the server`)
        
        const testM4a = fs.readFileSync('./test/audioSamples/sample.m4a', {encoding: 'base64'})

        socket.emit("session", 

        {
            langSource: "en-US",
            langTarget: "es-ES",
            audioData: testM4a,
            fileFormat: "m4a"
        })
    })

    if (detailLog){
        socket.on("partial-translation", (partialTranslation) => {
            console.log(`   Partial translation: ${partialTranslation.translation.slice(0,30)}`)
        })
    
        socket.on("partial-transcription", (partialTranscription) => {
            console.log(`   Partial transcription: ${partialTranscription}`)
        })
    }
        
    
    socket.on("final-translation", (finalTranslation) => {
        console.log(`    s:${socketLabel} final translation: ${finalTranslation.translation.slice(0,50)}`)
    })
    
    socket.on("final-transcription", (finalTranscription) => {
        console.log(`    s:${socketLabel} final translation: ${finalTranscription.slice(0, 50)}`)
    })

    socket.on("connect_error", (err) => {
        console.log(err.message)
    })

    setTimeout(() => socket.close(), 10000)
}


if (require.main === module){
    setTimeout(() => m4aReq(), 1000)
}

module.exports = m4aReq