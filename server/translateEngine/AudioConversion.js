// const fs = require('fs');
// const { spawn } = require('child_process');
const fs = require("fs")
const { spawn } = require("node:child_process")

// const AudioConversion = async (data) => {
const AudioConversion = async (data, inFilename, outFileName) => {
  // Decode the base64-encoded audio file
  //const decodedAudio = Buffer.from(data, 'base64');

  // Write the decoded audio to a temporary file
  fs.writeFileSync(inFilename, data, 'base64', { flag: 'w' });

  // Use ffmpeg to convert the audio file to .flac format
  const ffmpeg = await spawn('ffmpeg', [
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
    if (code === 0) {
      console.log('Audio file was converted to .flac format successfully');
      return outFileName
    } else {
      console.error(`ffmpeg exited with code ${code}`);
    }
  });

  // return ffmpeg;
};

module.exports = AudioConversion