const { io } = require('socket.io-client');
const fs = require("fs")

function printResults({connectedId, translation, transcription}){
    console.log(
`socket ${connectedId}
    translate: ${translation ? '✅' + translation.slice(0, 15) : '❌'}
    transcribe: ${transcription ? '✅' + transcription.slice(0, 15) : '❌'}`
)
}

const m4aReq = () => {
    let results = {
        connectedId: null,
        translation: null,
        transcription: null,
        
    }
    const socket = io("http://127.0.0.1:3000"); 
    socket.on("connect", () => {
        results.connectedId = socket.id.slice(0, 20)
        const testM4a = fs.readFileSync('/Users/blakebequette/fullstack/atocha/atocha-server/test/sample.m4a', {encoding: 'base64'})
        socket.emit("audio", 
        {
            langSource: "en-US",
            langTarget: "es-ES",
            audioData: testM4a,
            fileFormat: "m4a"
        })
        })

    // socket.on("partial-translation", (partialTranslation) => {
    //    console.log(`   Partial translation: ${partialTranslation.translation.slice(0,30)}`)
    // })

    socket.on("final-translation", (finalTranslation) => {
            results.translation = finalTranslation.translation
    })

    // socket.on("partial-transcription", (partialTranscription) => {
    //    console.log(`   Partial transcription: ${partialTranscription}`)
    // })

    socket.on("final-transcription", (finalTranscription) => {
        results.transcription = finalTranscription
    })

    socket.on('session-complete', () => {
        setTimeout(() => socket.close(), 10000)

    })

}