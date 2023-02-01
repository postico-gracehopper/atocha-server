const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');
require('dotenv').config();

class GoogleTextToSpeechSession {
  constructor(language, voiceGender = 'FEMALE') {
    this.gClient = new textToSpeech.TextToSpeechClient();
    (this.language = language),
      (this.voiceGender = voiceGender),
      (this.encoding = 'MP3');
  }

  requestify(text) {
    return {
      input: { text: text },
      voice: {
        languageCode: this.language,
        name: `${this.language}-Standard-A`,
      },
      audioConfig: { audioEncoding: this.encoding },
    };
  }

  googleSynthesizeSpeech(text) {
    return this.gClient.synthesizeSpeech(this.requestify(text));
  }

  async textToGoogleInternal(outputFileName, text) {
    const [response] = await this.googleSynthesizeSpeech(text);
    const writeFile = util.promisify(fs.writeFile);
    await writeFile(outputFileName, response.audioContent, 'binary');
    console.log(`Audio content written to file: ${outputFileName}`);
  }
}

async function speechToText(outputFileName, text, language, socket = false) {
  var collector = '';
  const session = new GoogleTextToSpeechSession(language);
  if (socket) {
    session.textToGoogleThenClient(outputFileName, text, socket);
  } else {
    session.textToGoogleInternal(outputFileName, text);
  }
}

module.exports = speechToText;
// speechToText(
//   './audio/textTextToSpeech.mp3',
//   'Test Google Text to Speech Features',
//   'en-US'
// );
