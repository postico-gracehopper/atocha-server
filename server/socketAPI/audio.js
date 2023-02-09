const AudioConversion = require("../translateEngine/AudioConversion")
const transcibeFile = require("../translateEngine/transcribeSession")
const translateFile = require("../translateEngine/translateSession")
const { db } = require("../dbFirebase")

const NUM_TEMPFILES = 5

module.exports = function handleAudio(socket, next){
    socket.on('session', async (data) => {
        const receivedTime = Date.now();
        let tempFlacPath 
        try {
            const randInt = Math.floor(Math.random()*NUM_TEMPFILES)
            tempFlacPath = await AudioConversion(
            data.audioData,
            `./audio/tempM4A${randInt}.m4a`,
            `./audio/serverSaved${randInt}.flac`
            );
            console.log('    Audio file was converted to .flac format successfully');
        } catch(err) {
            socket.emit('error', 'problem with sent audio file')
            console.log('audio could not be converted, error', err)
        }
        const conversionTime = Date.now();
    
        Promise.all([
            transcibeFile(tempFlacPath, data.langSource, socket, false).catch(
            console.error
            ),
            translateFile(
                tempFlacPath,
                data.langSource,
                data.langTarget,
                socket,
                false
            ).catch(console.error),
        ])
        .then((resp) => {
            socket.emit('session-complete')
            console.log('    Translation & Transcription complete')
            return resp
        })
        .catch((err) => {
            console.error(err);
            socket.emit('error', 'could not translate session audio');
        })
        .then(([translationObj, transciptionObj]) => {
            const sessionRecord = {
                user: socket.user.uid,
                langSource: data.langSource,
                langTarget: data.langTarget,
                ...translationObj,
                ...transciptionObj,
                convertElapsedTime: conversionTime - receivedTime,
                serverElapsedTime: Date.now() - receivedTime,
                date: Date.now()
            };
            return sessionRecord
        })
        .then((sessionRecord) => {
            return db.collection('TranslateSession')
                    .doc(`${socket.user.uid}-${sessionRecord.date}`)
                    .set(sessionRecord)
        }).then(() => console.log("    Saved to Google Firestore"))
        .catch(console.error)
        });
    next()
    }



