const port = process.env.PORT || 3000;
const express = require('express')
const path = require('path')
const morgan = require('morgan');

const app = express()

// static middleware
app.use(express.static(path.join(__dirname, '..','public')))
    .use(express.json())
    .use(express.urlencoded({extended: true}))
    .use(morgan('dev'))



app.use('/api', require('./api'))

app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});


// Error handling END - WEAR
app.use((err, req, res, next) => {
  //console.log(`ERROR: Request: ${req.path}, Received: ${err.status} ${err.message.slice(0,30)}`)
  res.status(err.status || 500).send(err.message || 'Internal server error.')
})


app.listen(port, ()=> console.log(`listening on port ${port}`));
