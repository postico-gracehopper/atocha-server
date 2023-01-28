const { SpeechTranslationServiceClient } = require('@google-cloud/media-translation');
const fs = require("fs")
require('dotenv').config()


class GoogleTranslateSession {
    constructor(langSource, langTarget, logging=false){
        this.gClient = new SpeechTranslationServiceClient()
        this.langSource = langSource
        this.langTarget = langTarget
        this.logging = logging
        this.encoding = "flac"
        this.config = {
            audioConfig: {
                audioEncoding: this.encoding,
                sourceLanguageCode: this.langSource,
                targetLanguageCode: this.langTarget
            },
            single_utterance: true
        }
        this.initialRequest = {
            streamingConfig: this.config,
            audioContent: null
        }
        this.finalTranslation
    }

    requestify(data){
        return {
            streamingConfig: this.config,
            audioContent: data
        }
    }
    
    log(...data){
        return this.logging ? console.log(...data) : () => {}
    }

    googleStream2Socket(clientSocketInstance){
        return this.gClient.streamingTranslateSpeech().on('data', (response) => {
            const { result } = response;
            if (result.textTranslationResult.isFinal) {
              this.log(
                `google <- atocha: *Final* translation: ${result.textTranslationResult.translation.slice(0,40)}`
              );
              clientSocketInstance.emit("final-translation", result.textTranslationResult)
            } else {
              this.log(
                `google <- atocha: Partial translation: ${result.textTranslationResult.translation.slice(0,40)}`
              )
              clientSocketInstance.emit("partial-translation", result.textTranslationResult)
            }
          }).on("error", (err) => this.log(err))
    }

    googleStream2Server(clback=()=>{}){
        return this.gClient.streamingTranslateSpeech().on('data', (response) => {
            const { result } = response;
            if (result.textTranslationResult.isFinal) {
              this.log(
                `google <- atocha: *Final* translation: ${result.textTranslationResult.translation.slice(0,40)}`
              );
              this.finalTranslation = result.textTranslationResult.translation
              clback(this.finalTranslation)
            } else {
              this.log(
                `google <- atocha: Partial translation: ${result.textTranslationResult.translation.slice(0,40)}`
              )
            }
          }).on("error", (err) => console.log(err))
    }


    localFlacToGoogleInternal(filename, clback){
        let chunks = [this.initialRequest]
        const gStream = this.googleStream2Server(clback)
        fs.createReadStream(filename).on("data", (data) => {
            chunks.push(this.requestify(data))
        }).on("close", () => {
            chunks.map(chunk => {
                gStream.write(chunk)
            })
            gStream.end()
        })
    }


    localFlacToGoogleThenClient(filename, clientSocketInstance){
        let chunks = [this.initialRequest]
        const gStream = this.googleStream2Socket(clientSocketInstance)
        fs.createReadStream(filename).on("data", (data) => {
            chunks.push(this.requestify(data))
        }).on("close", () => {
            chunks.map(chunk => {
                gStream.write(chunk)
            })
            gStream.end()
        })
    }

}


async function translateLocalFLAC(filename, langSrc, langTrgt, logging=false, socket=false){
    var collector = ""
    const session = new GoogleTranslateSession(langSrc, langTrgt, logging)
    if (socket) {
        session.localFlacToGoogleThenClient(filename, socket)
    } else {
        session.localFlacToGoogleInternal(filename)
    }
    return collector
    
}

if (require.main === module){
   translateLocalFLAC("../../test/sample.flac", "en-US", "es-ES", true, false)
}



module.exports = translateLocalFLAC