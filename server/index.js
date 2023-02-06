const port = process.env.PORT || 3000;
require('dotenv').config();
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const { Server } = require('socket.io');

const translateFile = require('./translateEngine/translateSession');
const transcibeFile = require('./translateEngine/transcribeSession');
const textTranslateString = require('./translateEngine/textTranslateSession');
const AudioConversion = require('./translateEngine/AudioConversion');

const app = express();

app
  .use(express.static(path.join(__dirname, '..', 'public')))
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use(morgan('dev'));

app.use('/api', require('./api'));

app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).send(err.message || 'Internal server error.');
});

const server = app.listen(port, () =>
  console.log(`\nlistening on port ${port}\n`)
);

const io = new Server(server);

io.on('connection', (socket) => {
  console.log('conneted to socket', socket.id);

  socket.on('audio', async (data) => {
    const receivedTime = Date.now();
    const tempFlacPath = await AudioConversion(
      data.audioData,
      './audio/tempM4A.m4a',
      './audio/serverSaved.flac'
    );
    const conversionTime = Date.now();

    Promise.all([
      transcibeFile(tempFlacPath, data.langSource, socket, false).catch(
        console.error
      ),
      translateFile(
        tempFlacPath,
        data.langSource,
        data.langTarget,
        socket,
        false
      ).catch(console.error),
    ])
      .then(([translationObj, transciptionObj]) => {
        const sessionRecord = {
          user: socket.id,
          langSource: data.langSource,
          langTarget: data.langTarget,
          ...translationObj,
          ...transciptionObj,
          convertElapsedTime: conversionTime - receivedTime,
          serverElapsedTime: Date.now() - receivedTime,
        };

        console.log(JSON.stringify(sessionRecord));
      })
      .then(() => socket.emit('session-complete'))
      .catch(() => {
        console.error;
        socket.emit('session-error');
      });
  });

  socket.on('text', async (data) => {
    const receivedTime = Date.now();
    Promise.all([
      textTranslateString(
        data.text,
        data.langSource,
        data.langTarget,
        socket,
        true
      ).catch(console.error),
    ])
      .then((translationObj) => {
        const sessionRecord = {
          user: socket.id,
          langSource: data.langSource,
          langTarget: data.langTarget,
          transcribedText: data.text,
          ...translationObj[0],
          convertElapsedTime: -1,
          serverElapsedTime: Date.now() - receivedTime,
        };

        console.log(JSON.stringify(sessionRecord));
      })
      .then(() => socket.emit('session-complete'))
      .catch(() => {
        console.error;
        socket.emit('session-error');
      });
  });
});
