const port = process.env.PORT || 3000;
require('dotenv').config()
const express = require('express');
const { Server } = require('socket.io');
const fs = require("fs")
const GoogleTranslateSession = require("./translateEngine/translateSession")
const AudioConversion = require("./translateEngine/AudioConversion")

const app = express();  

app.use('/api', require('./api'))
app.get("/", (req, res) => res.json("howdy, welcome to the landing page"))

const server = app.listen(port, () => console.log(`listening on port ${port}`));

const io = new Server(server)

io.on("connection", (socket) => {
  console.log("conneted to socket", socket.id)
  
  socket.on('audio', async (data) =>{
    const startTime = Date.now()
    const tempFlacPath = await AudioConversion(data.audioData, './audio/tempM4A.m4a', './audio/serverSaved.flac')
    
    var outTxt = ''
    const GTranslator = new GoogleTranslateSession(data.langSource, data.langTarget, true)
    const writeStream2Google = GTranslator.googleStream2SocketPlusLog(socket, (finalTranslation) => {
      return makeSessionRecord (socket.id, data.langSource, data.langTarget, data.audioData, finalTranslation.translation, startTime)
    })
    
    let chunks = [GTranslator.initialRequest]
    fs.createReadStream(tempFlacPath).on('data', (data) => {
      chunks.push(GTranslator.requestify(data))
    }).on('close', () => {
      chunks.map(chunk => {
        writeStream2Google.write(chunk)
      })
      writeStream2Google.end()
    })
    
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
