const axios = require('axios')

axios.post('http://localhost:3000/api/generateVocab',
    {
        inputLang: "English",
        outputLang: "Spanish",
        conversation: "outdoors activities"
    }   
).then(console.log).catch(err => {
    console.log("axios post request complete")
    console.log(err.message)
})