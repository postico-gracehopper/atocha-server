const port = process.env.PORT || 3000;
require("dotenv").config();
const path = require("path");
const express = require("express");
const { Server } = require("socket.io");
const fs = require("fs");
const morgan = require("morgan");
const GoogleTranslateSession = require("./translateEngine/translateSession");
const AudioConversion = require("./translateEngine/AudioConversion");
const bodyParser = require("body-parser");

const app = express();

app
  .use(express.static(path.join(__dirname, "..", "public")))
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use(morgan("dev"));

// parse application/json - for openAI post requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api", require("./api"));
app.get("/", (req, res) => res.json("howdy, welcome to the landing page"));

app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).send(err.message || "Internal server error.");
});

const server = app.listen(port, () =>
  console.log(`\nlistening on port ${port}\n`)
);

const io = new Server(server);

io.on("connection", (socket) => {
  console.log("conneted to socket", socket.id);

  socket.on("audio", async (data) => {
    const startTime = Date.now();
    const tempFlacPath = await AudioConversion(
      data.audioData,
      "./audio/tempM4A.m4a",
      "./audio/serverSaved.flac"
    );

    var outTxt = "";
    const GTranslator = new GoogleTranslateSession(
      data.langSource,
      data.langTarget,
      true
    );
    const writeStream2Google = GTranslator.googleStream2SocketPlusLog(
      socket,
      (finalTranslation) => {
        return makeSessionRecord(
          socket.id,
          data.langSource,
          data.langTarget,
          data.audioData,
          finalTranslation.translation,
          startTime
        );
      }
    );

    let chunks = [GTranslator.initialRequest];
    fs.createReadStream(tempFlacPath)
      .on("data", (data) => {
        chunks.push(GTranslator.requestify(data));
      })
      .on("close", () => {
        chunks.map((chunk) => {
          writeStream2Google.write(chunk);
        });
        writeStream2Google.end();
      });
  });
});

function makeSessionRecord(
  user,
  sourceLang,
  targetLang,
  inputFile,
  outputText,
  startTime
) {
  console.log(
    JSON.stringify({
      user,
      sourceLang,
      targetLang,
      inputFile: inputFile.slice(0, 20),
      outputText,
      elapsedTime: Date.now() - startTime,
    })
  );
}
