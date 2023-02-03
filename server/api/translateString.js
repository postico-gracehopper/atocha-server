const { Translate } = require("@google-cloud/translate").v2;

const projectId = "atocha-c5fca";
const keyFilename = "./translate-config.json";

const translate = new Translate({ projectId });

console.log("Here it is", process.env.GOOGLE_APPLICATION_CREDENTIALS);
const router = require("express").Router();

router.post("/", async (req, res, next) => {
  // const target = req.body.targetLang;
  const text = req.body.text;
  const target = "en";
  // const text = "snow";
  // const target = "ru";

  try {
    //   Translates the text into the target language. "text" can be a string for
    // translating a single piece of text, or an array of strings for translating
    // multiple texts.
    console.log("In the try block");
    console.log("text is", text);
    console.log("target is", target);
    let [translations] = await translate.translate(text, target);
    console.log("translations arrre", translations);
    translations = Array.isArray(translations) ? translations : [translations];
    let rez = [];
    translations.forEach((translation) => {
      if (translation !== "") {
        rez.push(`${translation}`);
      }
    });
    res.status(200).send(rez);
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(
        `Error with Google translate request (vocab): ${error.message}`
      );
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
});

module.exports = router;
