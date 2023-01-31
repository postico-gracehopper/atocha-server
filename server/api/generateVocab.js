const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const router = require("express").Router();

router.post("/", async (req, res, next) => {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured.",
      },
    });
    return;
  }

  const inputLang = "Spanish";
  const outputLang = "English";
  console.log("req dot obdy iss", req.body);

  function generateVocab(inputLang, outputLang) {
    return `"List 12 useful ${inputLang} vocab words related to the below messages. Avoid cognates. Follow each vocab word with ${outputLang} translation.
    "No, I've been taking it slow and exploring one area at a time.
    "Right now there is the tamale festival in Coyoacan. Go there and try some tamales. This Saturday is Candlemas and Candeleria Town is right inside Coyoacan. You can go and experience firsthand a traditional party."
    "Is Candlemas a holiday that's celebrated throughout Mexico?"
    `;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generateVocab(inputLang, outputLang),
      temperature: 0.8,
      max_tokens: 100,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
});

module.exports = router;
