const { io } = require('socket.io-client');

const socket = io('http://localhost:3000/audio')

socket.on('connect', (s) => {
    console.log('connected!')
    socket.emit('session', "this payload is for audio")
    
})

setTimeout(socket.disconnect, 10000)


