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
  const outputLang = req.body.outputLang;
  const conversation = req.body.conversation;

  function generateTeacher(inputLang, outputLang, conversation) {
    return `I'm an ${inputLang} speaker trying to learn ${outputLang}. Act like a teacher and explain the words in this sentence to me in ${inputLang}: 
    ${conversation}`;
  }

  try {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: generateTeacher(inputLang, outputLang, conversation),
      temperature: 0.85,
      max_tokens: 250,
    });
    console.log('completion', completion.data.choices[0].text, '|');
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
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
