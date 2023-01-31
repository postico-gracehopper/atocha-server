const port = process.env.PORT || 3000;
require("dotenv").config();
const express = require("express");
const { Server } = require("socket.io");
const fs = require("fs");
const translateLocalFLAC = require("./translateEngine/translateSession");
const AudioConversion = require("./translateEngine/AudioConversion");
// const bodyParser = require("body-parser");

const app = express();

// parse application/json - for openAI post requests
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

app.use("/api", require("./api"));
app.get("/", (req, res) => res.json("howdy, welcome to the landing page"));

const server = app.listen(port, () => console.log(`listening on port ${port}`));

const io = new Server(server);

io.on("connection", (socket) => {
  console.log("conneted to socket", socket.id);

  socket.on("audio", async (data) => {
    if (data.fileFormat === "flac") {
      fs.writeFileSync("./audio/serverSaved.flac", data.audioData, "base64", {
        flag: "w",
      });
      translateLocalFLAC(
        "./audio/serverSaved.flac",
        data.langSource,
        data.langTarget,
        true,
        socket
      );
    } else if (data.fileFormat === "m4a") {
      console.log("received an m4a");
      const tempFlacPath = await AudioConversion(
        data.audioData,
        "./audio/tempM4A.m4a",
        "./audio/serverSaved.flac"
      );
      translateLocalFLAC(
        tempFlacPath,
        data.langSource,
        data.langTarget,
        true,
        socket
      );
    }
  });
});
