const router = require("express").Router();
// const { exec } = require("child_process");

// middleware : need to be a registered user
router.post("/", async (req, res, next) => {
  try {
    // Get AUDIO from req
    // Check/verify audio
    // Get translation config from USER + REQUEST
    // TRANSLATE
    // const postTranslateText = translateEngine.dummy("sampleAudio.wav"
    // SEND BACK TO USER
    res.json({
      thishasbeen: "deprecated",
    });
  } catch (err) {
    err.status = 500;
    err.message = "Could not translate the audio file!";
    next(err);
  }
});

module.exports = router;
