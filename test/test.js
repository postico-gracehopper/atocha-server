require('dotenv').config()

const fs = require('fs');

// Imports the CLoud Media Translation client library
const {
  SpeechTranslationServiceClient,
} = require('@google-cloud/media-translation');

// Creates a client
const client = new SpeechTranslationServiceClient();

async function translate_from_file() {
  /**
   * TODO(developer): Uncomment the following lines before running the sample.
   */
  // const filename = 'Local path to audio file, e.g. /path/to/audio.raw';
  // const encoding = 'Encoding of the audio file, e.g. LINEAR16';
  // const sourceLanguage = 'BCP-47 source language code, e.g. en-US';
  // const targetLanguage = 'BCP-47 target language code, e.g. es-ES';

  const config = {
    audioConfig: {
      audioEncoding: encoding,
      sourceLanguageCode: sourceLanguage,
      targetLanguageCode: targetLanguage,
    },
    single_utterance: true,
  };

  // First request needs to have only a streaming config, no data.
  const initialRequest = {
    streamingConfig: config,
    audioContent: null,
  };

  const readStream = fs.createReadStream(filename, {
    highWaterMark: 4096,
    encoding: 'base64',
  });

  const chunks = [];
  readStream
    .on('data', chunk => {
      const request = {
        streamingConfig: config,
        audioContent: chunk.toString(),
      };
      chunks.push(request);
    })
    .on('close', () => {
      // Config-only request should be first in stream of requests
      stream.write(initialRequest);
      for (let i = 0; i < chunks.length; i++) {
        stream.write(chunks[i]);
      }
      stream.end();
    });

  const stream = client.streamingTranslateSpeech().on('data', response => {
    const {result} = response;
    if (result.textTranslationResult.isFinal) {
      console.log(
        `\nFinal translation: ${result.textTranslationResult.translation}`
      );
      console.log(`Final recognition result: ${result.recognitionResult}`);
    } else {
      console.log(
        `\nPartial translation: ${result.textTranslationResult.translation}`
      );
      console.log(`Partial recognition result: ${result.recognitionResult}`);
    }
  })
}