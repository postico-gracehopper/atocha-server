const { io } = require('socket.io-client');
const fs = require("fs")



// Simulate a M4a translation request
const m4aReq = () => {
    const socket = io("http://127.0.0.1:3000"); 
    socket.on("connect", () => {
        console.log("connected to socket server ")
        
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
            console.log(finalTranslation)
            socket.close()
    })
}

// Simulate a Flac request
const flacReq = () => {
    const socket = io("http://127.0.0.1:3000"); 
    socket.on("connect", () => {
        console.log("connected to socket server ")
        
        const testM4a = fs.readFileSync('/Users/blakebequette/fullstack/atocha/atocha-server/test/sample.flac', {encoding: 'base64'})
        socket.emit("audio", 
        {
            langSource: "en-US",
            langTarget: "es-ES",
            audioData: testM4a,
            fileFormat: "flac"
        })
    })

    socket.on("final-translation", (finalTranslation) => {
        console.log(finalTranslation)
        socket.close()
    })
}


setTimeout(m4aReq, 2000)
setTimeout(flacReq, 10000)