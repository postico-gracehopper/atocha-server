const audioHandler = require("./audio")
const textHandler = require("./text")
const middleware = require("./middleware")

module.exports = {
    audio: audioHandler,
    text: textHandler,
    middleware,
}