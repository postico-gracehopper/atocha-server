const axios = require("axios");
import { uri } from "../constants";

axios
  .post(`${uri}/api/generateVocab`, {
    inputLang: "English",
    outputLang: "Spanish",
    conversation: "outdoors activities",
  })
  .then(console.log)
  .catch((err) => {
    console.log("axios post request complete");
    console.log(err.message);
  });
