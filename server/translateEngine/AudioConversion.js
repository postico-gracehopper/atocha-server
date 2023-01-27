// const fs = require('fs');
// const { spawn } = require('child_process');
import fs from 'fs';
import { spawn } from 'child_process';
import { translate_from_file } from '../../google.js';

// const AudioConversion = async (data) => {
export const AudioConversion = async (data) => {
  // Decode the base64-encoded audio file
  const decodedAudio = Buffer.from(data, 'base64');

  // Write the decoded audio to a temporary file
  fs.writeFileSync('temp_audio.m4a', decodedAudio, { flag: 'w' });

  // Use ffmpeg to convert the audio file to .flac format
  const ffmpeg = await spawn('ffmpeg', [
    '-y',
    '-i',
    'temp_audio.m4a',
    '-ar',
    '16000',
    '-ac',
    '1',
    'decoded_audio.flac',
  ]);

  ffmpeg.on('exit', (code) => {
    if (code === 0) {
      console.log('Audio file was converted to .flac format successfully');
      return translate_from_file();
    } else {
      console.error(`ffmpeg exited with code ${code}`);
    }
  });

  // return ffmpeg;
};

// module.exports = AudioConversion;

// AudioConversion();
