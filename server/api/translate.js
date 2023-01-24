const router = require('express').Router();

router.get("/", async (req, res, next) => {
    res.json({translation: "Let's take a walk around the park"})
})

router.post("/", async (req, res, next) => {
    const  { audioToTranslate } = req.body
    res.json("")
})

module.exports = router