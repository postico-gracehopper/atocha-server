const { io } = require('socket.io-client');
const fs = require("fs")
const getAllTokens = require("./getTokens.spec")



const m4aReq = async (detailLog=false, socketName="") => {
    return new Promise(async (resolve, reject) => {
        let result = {src: null, tgt: null}
        const socketLabel = socketName === "" ? String(Math.random()*10000).slice(0,4) : socketName
        const tokens = await getAllTokens()
        const socket = io("http://127.0.0.1:3000/audio", {auth: {token: tokens.tokenUser}}); 
        socket.on("connect", () => {
            console.log(`skt:${socketLabel} is connected to the server`)
            
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
            console.log(`    skt:${socketLabel} final translation: ${finalTranslation.translation.slice(0,50)}`)
            result.tgt = finalTranslation.translation
            checkIfCompleteAndResolve()
        })
        
        socket.on("final-transcription", (finalTranscription) => {
            console.log(`    skt:${socketLabel} final translation: ${finalTranscription.slice(0, 50)}`)
            result.src = finalTranscription
            checkIfCompleteAndResolve()
        })
    
        socket.on("connect_error", (err) => {
            console.log('🟥', err.message)
        })

        function checkIfCompleteAndResolve(){
            if (result.src && result.tgt 
                && typeof result.tgt === 'string' 
                && typeof result.src === 'string'
                && result.tgt.length > 2 
                && result.src.length > 2){
                    console.log(`🟩 s:${socketLabel} successful`)
                    socket.disconnect()
                    resolve(true)
                }
        }
    
        setTimeout(() => {
            socket.close()
        }, 5000)
    }
    )}


if (require.main === module){
    setTimeout(m4aReq, 1000)
}

module.exports = m4aReq