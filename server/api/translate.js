const router = require('express').Router();

router.get("/", async (req, res, next) => {
    res.json({translation: "Let's take a walk around the park"})
})

router.post("/", async (req, res, next) => {
    const  { audioToTranslate } = req.body
    // req.user
    const { languageFrom } = req.user

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
})

module.exports = router