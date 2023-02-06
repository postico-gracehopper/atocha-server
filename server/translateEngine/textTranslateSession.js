const { Translate } = require('@google-cloud/translate').v2;
const translate = new Translate();

class GoogleTextTranslateSession {
  constructor(langSource, langTarget, logging) {
    this.startTime = Date.now();
    this.langSource = langSource;
    this.langTarget = langTarget;
    this.logging = logging;
  }

  async googleTextTranslateStream(
    text,
    clientSocket = null,
    callback,
    erCallback
  ) {
    let translations;
    try {
      [translations] = await translate.translate(text, this.langTarget);
      translations = Array.isArray(translations)
        ? translations
        : [translations];
      if (clientSocket) {
        clientSocket.emit('final-translation', translations[0]);
      }
      callback({
        translation: translations[0],
        translateElapsedTime: Date.now() - this.startTime,
      });
    } catch (error) {
      erCallback || console.error;
    }
    return translations;
  }
}

function textTranslateString(
  text,
  langSource,
  langTarget,
  clientSocket = null,
  logging = false
) {
  return new Promise((resolve, reject) => {
    const GTextTranslate = new GoogleTextTranslateSession(
      langSource,
      langTarget,
      logging
    );
    GTextTranslate.googleTextTranslateStream(
      text,
      clientSocket,
      (finalTranslation) => {
        resolve(finalTranslation);
      },
      (error) =>
        reject(`Google text translation had the following error: ${error}`)
    );
  });
}

module.exports = textTranslateString;
