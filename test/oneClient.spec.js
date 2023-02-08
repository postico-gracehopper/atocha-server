const { io } = require('socket.io-client');
const fs = require("fs")



// Simulate a M4a translation request
const m4aReq = () => {
    const socket = io("https://atocha.up.railway.app"); //"http://localhost:3000") //
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

    socket.on("error", err => console.log(err))

    setTimeout(() => socket.close(), 10000)
}

// // Simulate a Flac request
// const flacReq = () => {
//     const socket = io("http://127.0.0.1:3000"); 
//     socket.on("connect", () => {
//         console.log("connected to socket server ")
        
//         const testM4a = fs.readFileSync('/Users/blakebequette/fullstack/atocha/atocha-server/test/sample.flac', {encoding: 'base64'})
//         socket.emit("audio", 
//         {
//             langSource: "en",
//             langTarget: "es",
//             audioData: testM4a,
//             fileFormat: "flac"
//         })
//     })

//     socket.on("final-translation", (finalTranslation) => {
//         console.log(finalTranslation)
//         socket.close()
//     })
// }

if (require.main === module){
    setTimeout(m4aReq, 1000)
}

module.exports = m4aReq