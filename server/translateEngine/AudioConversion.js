// const fs = require('fs');
// const { spawn } = require('child_process');
const fs = require("fs")
const { spawn } = require("node:child_process")

// const AudioConversion = async (data) => {
const AudioConversion = (data, inFilename, outFileName) => {
  return new Promise((resolve, reject) => {
    fs.writeFileSync(inFilename, data, 'base64', { flag: 'w' });
  
    // Use ffmpeg to convert the audio file to .flac format
    const ffmpeg = spawn('ffmpeg', [
      '-y',
      '-i',
      inFilename,
      '-ar',
      '16000',
      '-ac',
      '1',
      outFileName,
    ]);
  
    ffmpeg.on('exit', (code) => {
      console.log("converted with the following code", code)
      if (code === 0) {
        resolve(outFileName)
      } else {
        reject(new Error("could not convert file"))
        console.error(`ffmpeg exited with code ${code}`);
      }
    });
  })
}

module.exports = AudioConversion