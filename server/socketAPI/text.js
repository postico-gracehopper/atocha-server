const textTranslateString = require("../translateEngine/textTranslateSession")
const { db } = require("../dbFirebase")


module.exports = function handleText(socket, next){
    socket.on('session', async (data) => {
        const receivedTime = Date.now();
       
        textTranslateString(
            data.text,
            data.langSource,
            data.langTarget,
            socket,
            true
        )
        .then(resp => {
            socket.emit("session-complete")
            console.log('    Text-translation complete')
            return resp
        })
        .catch((err) => {
            console.error(err)
            socket.emit("error", "could not translate session text")
        })
        .then((translationObj) => {
            const sessionRecord = {
                user: socket.id,
                langSource: data.langSource,
                langTarget: data.langTarget,
                transcribedText: data.text,
                ...translationObj[0],
                convertElapsedTime: -1,
                serverElapsedTime: Date.now() - receivedTime,
            };

            return sessionRecord
        })
        .then((sessionRecord) => {
            return db.collection('TranslateSession')
                    .doc(`${socket.user.uid}-${sessionRecord.date}`)
                    .set(sessionRecord)
        })
        .then(() => console.log("    Saved to Google Firestore"))
        .catch(console.error)
    });
    next()
}