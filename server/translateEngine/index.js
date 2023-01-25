const googleAPI = require("./google")
const dummy = require("./dummy")


const translator = {
    google: googleAPI,
    dummy: dummy,
}


module.exports = translator