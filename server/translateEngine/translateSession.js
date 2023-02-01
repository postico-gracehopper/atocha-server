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


    googleStream2SocketPlusLog(clientSocketInstance, callback){
        return this.gClient.streamingTranslateSpeech().on('data', (response) => {
                const { result } = response;
                if (result.textTranslationResult.isFinal) {
                    this.log(
                        `google <- atocha: *Final* translation: ${result.textTranslationResult.translation.slice(0,40)}`
                    );
                    this.finalTranslation = result.textTranslationResult.translation
                    if (clientSocketInstance) {
                        clientSocketInstance.emit('final-translation', result.textTranslationResult)
                    }
                    callback(result.textTranslationResult)
                } else {
                this.log(
                    `google <- atocha: Partial translation: ${result.textTranslationResult.translation.slice(0,40)}`
                    )
                    if (clientSocketInstance) {
                        clientSocketInstance.emit("partial-translation", result.textTranslationResult)
                    }
                    }
            }).on("error", (err) => console.error(err))
        }

}


function translateFile(filename, langSource, langTarget, clientsocket, logging=false){
    return new Promise ((resolve, reject) => {
        const GTranslator = new GoogleTranslateSession(langSource, langTarget, logging)
        const writeStream2Google = GTranslator.googleStream2SocketPlusLog(clientsocket, (finalTranslation) =>{
            resolve(finalTranslation)
        })

        let chunks = [GTranslator.initialRequest]
        fs.createReadStream(filename).on('data', (data) => {
            chunks.push(GTranslator.requestify(data))
        }).on('close', () => {
            chunks.map(chunk => {
                writeStream2Google.write(chunk)
            })
            writeStream2Google.end()
        }).on('err', (err) => {
            reject(err)
        })
    })
}

if (require.main === module){
   translateFile("../../test/sample.flac", "en-US", "es-ES", null, false)
}



module.exports = translateFile