const port = process.env.PORT || 3000;
require('dotenv').config()
const path = require('path')
const express = require('express');
const { Server } = require('socket.io');
const fs = require("fs")
const morgan = require("morgan")
const translateFile = require("./translateEngine/translateSession")
const AudioConversion = require("./translateEngine/AudioConversion")

const app = express()

app.use(express.static(path.join(__dirname, '..','public')))
    .use(express.json())
    .use(express.urlencoded({extended: true}))
    .use(morgan('dev'))


app.use('/api', require('./api'))

app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).send(err.message || 'Internal server error.')
})


const server = app.listen(port, () => console.log(`\nlistening on port ${port}\n`));

const io = new Server(server)

io.on("connection", (socket) => {
  console.log("conneted to socket", socket.id)
  
  socket.on('audio', async (data) =>{
    const startTime = Date.now()
    const tempFlacPath = await AudioConversion(data.audioData, './audio/tempM4A.m4a', './audio/serverSaved.flac')
    translateFile(tempFlacPath, data.langSource, data.langTarget, socket, true).then((finalTranslation) => {
      console.log(JSON.stringify(finalTranslation))
    })
    /// transcibeFile()
    
  })
  
})


function makeSessionRecord(user, sourceLang, targetLang, inputFile, outputText, startTime){
  console.log(JSON.stringify(
    {
      user,
      sourceLang,
      targetLang,
      inputFile: inputFile.slice(0,20), 
      outputText,
      elapsedTime: Date.now() - startTime
    }
  ))
}
