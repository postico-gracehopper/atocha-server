const port = process.env.PORT || 3000;
require('dotenv').config();
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const { Server } = require('socket.io');
const socketHandlers = require("./socketAPI")

const {db, auth} = require('./dbFirebase')

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

const loggingMiddleware = (s, next) => {
  console.log(`WS: dest: ${s.adapter.nsp.name}, socket: ${s.id}`)
  next()
  // Example of sending back an error
  // const e = new Error("thats not allowed")
  // next(e)
}

io.of('/audio')
  .use(loggingMiddleware)
  .use(socketHandlers.audio)
  
  