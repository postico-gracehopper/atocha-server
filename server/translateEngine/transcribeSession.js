const speech = require('@google-cloud/speech');
const fs = require('fs');
const client = new speech.SpeechClient();

class GoogleTranscribeSession {
  constructor(langSource, logging) {
    this.startTime = Date.now();
    this.langSource = langSource;
    this.logging = logging;
    this.request = {
      config: {
        encoding: 'FLAC',
        sampleRateHertz: 16000,
        languageCode: langSource,
        enableAutomaticPunctuation: true,
      },
      interimResults: true,
    };
  }

  googleTranscribeStream(clientSocket = null, callback, erCallback) {
    return client
      .streamingRecognize(this.request)
      .on('error', erCallback || console.error)
      .on('data', (data) => {
        const { isFinal } = data.results[0];
        const { transcript } = data.results[0].alternatives[0];
        if (isFinal) {
          if (clientSocket)
            clientSocket.emit('final-transcription', transcript);
          if (this.logging)
            console.log(
              `google <- atocha: Final transcription: ${transcript.slice(
                0,
                40
              )}`
            );
          callback({
            transcription: transcript,
            confidence: data.results[0].alternatives[0].confidence,
            transcribeElapsedTime: Date.now() - this.startTime,
          });
        } else {
          if (clientSocket) {
            clientSocket.emit('partial-transcription', transcript);
          }
          if (this.logging)
            console.log(
              `google <- atocha: Partial transcription: ${transcript.slice(
                0,
                40
              )}`
            );
        }
      });
  }
}

function transcibeFile(
  filename,
  langSource,
  clientSocket = null,
  logging = false
) {
  return new Promise((resolve, reject) => {
    const GTranscriber = new GoogleTranscribeSession(langSource, logging);
    const writeStream2Google = GTranscriber.googleTranscribeStream(
      clientSocket,
      (finalTranscription) => {
        resolve(finalTranscription);
      },
      (err) => reject(`Google speech to text had the following error: ${err}`)
    );

    fs.createReadStream(filename).pipe(writeStream2Google);
  });
}

module.exports = transcibeFile;
