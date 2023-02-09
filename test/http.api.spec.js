const axios = require("axios")
const getAllTokens = require("./getTokens.spec")
require("dotenv").config()

async function probeAPIRoutes(){
    const tokens = await getAllTokens()
    const host = process.env.HOST === 'prod' ?  "crinkle" : "http://localhost:3000"
    const reqObjects = [
        {route: 'api/checkDocker', action: axios.get, user: tokens.tokenUser },
        {route: 'api/generateVocab', action: axios.post, user: tokens.tokenUser, body: {}},
        {route: 'api/generateTeacher', action: axios.post, user: tokens.tokenUser, body: {}},
        {route: 'api/generateSuggestions', action: axios.post, user: tokens.tokenUser, body: {}},
        {route: 'api/translateString', action: axios.post, user: tokens.tokenUser, body: {text: "lets learn to code computer games", targetLang: 'es-MX'}},
    ]
    //axios.get(`${host}/api/generateVocab`, {headers: {auth: tokens.tokenUser}}).then(({data}) => console.log(data)) //.then((response) => console.log(200 === response.status ? '🟩' : '🟥')).catch(() => console.log('🟥'))
    reqObjects.forEach(async ({action, route, user, body}) => {
        if (action === axios.post){
            action(`${host}/${route}`, body, {headers: {auth: user}})
                .then((response) => console.log(`🟩 ${route}, ${JSON.stringify(response.data)}`))
                .catch((err) => console.log(`🟥  ${route},  ${err.code} ${err.message}`))
        } else if (action === axios.get){
            action(`${host}/${route}`, {headers: {auth: user}})
                .then((response) => console.log(`🟩 ${route}, ${response.data}`))
                .catch((err) => console.log(`🟥 ${route},  ${err.code} ${err.message}`))
        }
    })
}


if (require.main === module){

    console.log("-- TESTING HTTP ROUTES --")
    probeAPIRoutes()
}