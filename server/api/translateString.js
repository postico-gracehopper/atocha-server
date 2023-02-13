const { Translate } = require("@google-cloud/translate").v2;
const router = require("express").Router();

const projectId = "atocha-c5fca";

const translate = new Translate({ projectId });

router.post("/", async (req, res, next) => {
  const target = req.body.targetLang;
  // const target = "en";
  const text = req.body.text;

  try {
    if (!text || !target) throw new Error("arguments")
    let [translations] = await translate.translate(text, target);
    translations = Array.isArray(translations) ? translations : [translations];
    let rez = [];
    translations.forEach((translation) => {
      if (translation !== "") {
        rez.push(`${translation}`);
      }
    });
    res.status(200).send(rez);
  } catch (error) {
    if (error.message === "arguments"){
      error.status = 400
      error.message = "must include text and targetLang in the request body"
    }
    console.error(error)
    next(error)
    // if (error.response) {
    //   console.error(error.response, error.reponse.statusCode)
    //   console.error(error.response.status, error.response.data);
    //   res.status(error.response.status).json(error.response.data);
    // } else {
    //   console.error(
    //     `Error with Google translate request (vocab): ${error.message}`
    //   );
    //   res.status(500).json({
    //     error: {
    //       message: "An error occurred during your request.",
    //     },
    //   });
    // }
  }
});

module.exports = router;
