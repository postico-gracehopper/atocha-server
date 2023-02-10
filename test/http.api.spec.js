const axios = require("axios")
const getAllTokens = require("./getTokens.spec")
require("dotenv").config()
const host = process.env.MODE === 'DEV' ?  process.env.LOCAL_URL : process.env.LIVE_URL 


async function probeAPIRoutes(){
    const tokens = await getAllTokens()
    let reqObjects = [
        {route: '', action: axios.get, user: tokens.tokenBad },
        // {route: 'api/checkDocker', action: axios.get, user: tokens.tokenUser },
        {route: 'api/generateVocab', action: axios.post, user: tokens.tokenUser, body: {inputLang: "Spanish", conversation: "Gardening"}},
        // {route: 'api/generateTeacher', action: axios.post, user: tokens.tokenUser, body: {inputLang: "English", outputLang: "French", conversation: "Pretend you're talking about what you might have for dinner."}},
        // {route: 'api/generateSuggestions', action: axios.post, user: tokens.tokenUser, body: {inputLang: "English", outputLang: "Spanish", conversation: "Would you like to go to dinner tonight?"}},
        // {route: 'api/translateString', action: axios.post, user: tokens.tokenUser, body: {text: "lets learn to code computer games", targetLang: 'es-MX'}},
    ]
    
    reqObjects.forEach(async ({action, route, user, body}) => {
        console.log(`${host}/${route}`)
        if (action === axios.post){
            action(`${host}/${route}`, body, {headers: {auth: user}})
                .then((response) => console.log(`   🟩 user /${route}, ${response.data.result ? response.data.result : JSON.stringify(response.data.slice(5,50))}`))
                .catch((err) => console.log(`   🟥 user /${route},  ${err.code} ${err.message}`))
        } else if (action === axios.get){
            action(`${host}/${route}`, {headers: {auth: user}})
                .then((response) => console.log(`   🟩 user /${route}, ${JSON.stringify(response.data).slice(0,49)}`))
                .catch((err) => console.log(`   🟥 user /${route},  ${err.code} ${err.message}`))
        }
    })


    // again with a bad token 
    // reqObjects.map(o => {
    //     o.user = tokens.tokenBad
    // })

    // reqObjects.forEach(async ({action, route, user, body}) => {
    //     if (action === axios.post){
    //         action(`${host}/${route}`, body, {headers: {auth: user}})
    //             .then((response) => console.log(`   🟥 nonuser /${route}, ${response.data.result ? response.data.result : JSON.stringify(response.data)}`))
    //             .catch((err) => console.log(`   🟩 nonuser /${route},  ${err.code} ${err.message}`))
    //     } else if (action === axios.get && route === 'api/checkDocker'){
    //         action(`${host}/${route}`, {headers: {auth: user}})
    //             .then((response) => console.log(`   🟥 nonuser /${route}, ${JSON.stringify(response.data).slice(0,49)}`))
    //             .catch((err) => console.log(`   🟩 nonuser /${route},  ${err.code} ${err.message}`))
    //     } else if (action === axios.get && route === ''){
    //         action(`${host}/${route}`, {headers: {auth: user}})
    //             .then((response) => console.log(`   🟩 nonuser /${route}, ${JSON.stringify(response.data).slice(0,49)}`))
    //             .catch((err) => console.log(`   🟥 nonuser /${route},  ${err.code} ${err.message}`))
    //     }
    // })

    // reqObjects.map(({user, body, action, route}) => {
    //     user = tokens.tokenUser
    //     body = {}
    //     if (action === axios.post){
    //         action(`${host}/${route}`, body, {headers: {auth: user}})
    //             .then((response) => console.log(`   🟥 user+noBody user /${route}, ${response.data.result ? response.data.result : JSON.stringify(response.data)}`))
    //             .catch((err) => console.log(`   🟩 user+noBody /${route},  ${err.code} ${err.message} ${err.response.data || err.response.result}`))
    //     } else if (action === axios.get){
    //         action(`${host}/${route}`, {headers: {auth: user}})
    //             .then((response) => console.log(`   🟩 user+noBody /${route}, ${JSON.stringify(response.data).slice(0,49)}`))
    //             .catch((err) => console.log(`   🟥 user+noBody /${route},  ${err.code} ${err.message} ${err.response.data}`))
    //     }
    // })

    
}


if (require.main === module){

    console.log("-- TESTING HTTP ROUTES --")
    probeAPIRoutes()
}