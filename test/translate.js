const axios = require("axios")

const url = process.env.mode === "LOCAL" ? local

async function testTranslate() {
    try {
        const data = await axios.post(url, {})
    } catch(err){

    }


}

if (module === require.main){
    testTranslate()
}