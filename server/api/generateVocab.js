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

  const inputLang = req.body.inputLang;
  const outputLang = req.body.outputLang;
  const conversation = req.body.conversation;

  function generateVocab(lang1, lang2, messages) {
    return `List 8 ${lang1} words related to the below message. Follow each vocab word with its ${lang2}. None of these pairs should be cognates. List only the vocab words, no language labels. Line break for each new ${lang1} word.
    Message: ${messages}
    `;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generateVocab(inputLang, outputLang, conversation),
      temperature: 0.85,
      max_tokens: 200,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.log("Input lang is", inputLang);
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
