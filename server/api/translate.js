const router = require('express').Router();
const { exec } = require("child_process");

router.get("/", async (req, res, next) => {
    res.json({translation: "Let's take a walk around the park"})
})

router.post("/", async (req, res, next) => {
    const  { audioToTranslate } = req.body
    // req.user
    // const { languageFrom } = req.user

    const config = {
        languageFrom: "en",
        languageTo: "es",
        apiKey: process.env.GOOGLE_API_KEY
    }
    // send to Google api
    // const data = google.response
    // 
    // res.json(
    //     {
    //         textReponse: "a;sldkfj;owiejrfo "
    //     }
    // )
    res.json({
        langFrom: "en",
        langTo: "es",
        textResponse: "The quick brown fox jumped over the lazy dog."
    })
})

router.post("/test/", async (req, res, next) => {
    exec("argos-translate --from en --to es \"I have a lot of food\"", (err, stdout, stdin) => {
        if (err) console.log(err)
        else res.json({textResponse: stdout.slice(0, -2)})
    })
})

module.exports = router