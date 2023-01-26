const { io } = require('socket.io-client');
const fs = require("fs")


// microphoneSession.createStream().on("data", data => {
//     4096
// })

const socket = io("http://127.0.0.1:3000"); 
/* 
Never seen window.location before? This object describes the URL of the page we're on! 
*/ 


socket.on("send-it", (serverSocket) => {
    console.log("connected to server!")
    
    fs.createReadStream("./output.flac", {highWaterMark: 4096, encoding: 'base64'})
        .on("data", (chunk) => {
            console.log(chunk)
            socket.emit('audio', chunk)
        })
})




setTimeout(() => {
    socket.emit("hello", "a random string")
}, 3000)

socket.on("new-time", (time) => console.log(time.slice(0,20)))

console.log("got here")




// console.log("opening a socket!")

// clientSocket.on('connect', (socket) => { 
//     console.log('Connected to server'); 

// })

// clientSocket.emit("hello from client")
// clientSocket.addEventListener("message", (data) => {
//     const packet = data

//     console.log(packet)
// })



// const clientSocket2 = socket("http://127.0.0.1:3000"); 
// /* 
//   Never seen window.location before? This object describes the URL of the page we're on! 
// */ 

// clientSocket2.on('connect', () => { 
//   console.log('Connected to server'); 
// })
// fs.createReadStream("middlemarch.txt").on("data", data => {
//     console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>NEW CHUNK")
//     console.log(data.toString())
// })

