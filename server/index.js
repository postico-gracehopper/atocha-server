const port = process.env.PORT || 3000;
require('dotenv').config();
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const { Server } = require('socket.io');
const socketHandlers = require("./socketAPI")


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

// error catcher
app.use((err, req, res, next) => {
  res.status(err.status || 500).send(err.message || 'Internal server error.');
});

const server = app.listen(port, () =>
  console.log(`\nlistening on port ${port}\n`)
);



const io = new Server(server);

io.use(socketHandlers.middleware.checkForGoogleIDToken) // checkForGoogleIDToken needs to come before logger, as logger depends on user
  .use(socketHandlers.middleware.logger)
  .on("connect", (s) => s.emit("hello from server"))

io.of('/audio')
  .use(socketHandlers.middleware.checkForGoogleIDToken)
  .use(socketHandlers.middleware.logger)
  .use(socketHandlers.audio)

io.of('/text')
  .use(socketHandlers.middleware.checkForGoogleIDToken)
  .use(socketHandlers.middleware.logger)
  .use(socketHandlers.text)
