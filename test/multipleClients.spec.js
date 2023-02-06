const { io } = require('socket.io-client');
const fs = require("fs")

function printResults({connectedId, translation, transcription, no, time}){
    console.log(
`#${no} socket ${connectedId}
    translate: ${translation ? '✅' + translation.slice(0, 15) : '❌'}
    transcribe: ${transcription ? '✅' + transcription.slice(0, 15) : '❌'}
    time: ${time}`
)
}

const m4aReq = (no) => {
    let results = {
        no: no, 
        connectedId: null,
        translation: null,
        transcription: null,
        time: Date.now()
        
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
    socket.on("final-translation", (finalTranslation) => {
            results.translation = finalTranslation.translation
    })

    socket.on("final-transcription", (finalTranscription) => {
        results.transcription = finalTranscription
    })

    socket.on('session-complete', () => {
        results.time = Date.now() - results.time
        setTimeout(() => printResults(results), 1000)
    })
}

const NUM_CLIENTS = 10
const TIMESPAN = 10 * 1000 // seconds * milliseconds
const clients = Array(NUM_CLIENTS).fill(0).map(() => Math.floor(Math.random() * TIMESPAN))
clients.map((client, numberSocket)=> {
    console
    setTimeout(() => m4aReq(numberSocket), client)
})