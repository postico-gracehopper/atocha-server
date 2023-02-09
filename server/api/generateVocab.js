const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const router = require('express').Router();

router.post('/', async (req, res, next) => {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: 'OpenAI API key not configured.',
      },
    });
    return;
  }

  const inputLang = req.body.inputLang;
  const conversation = req.body.conversation;

  function generateVocab(lang1, messages) {
    return `Generate three useful ${lang1} words and two idiomatic phrases related to the below message. The five results should not be numbered. They should not include English definitions. Separate each result with a comma.
    Message: ${messages}`;
  }

  try {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: generateVocab(inputLang, conversation),
      temperature: 0.8,
      max_tokens: 200,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    if (!inputLang || !conversation) throw new Error("Must provide a input language and conversation topic to generate vocab")
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.log('Input lang is', inputLang);
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        },
      });
    }
  }
});

module.exports = router;
