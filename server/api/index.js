'use strict'
const router = require('express').Router()
const { getAuth } = require('firebase-admin/auth')


router.use(async (req, res, next) => {
  try {
    const { auth } = req.headers
    const uid = await getAuth().verifyIdToken(auth)
    req.uid = uid
    next()
  } catch(err) {
    console.log(err)
    err.status = 404
    err.message = "Could not verify user: please include {headers: {auth: <GoogleIDTokenString>}} in request"
    next(err)
  }
})


router.use('/checkDocker', require('./checkDocker'))
router.use("/generateVocab", require("./generateVocab"));

// catch all the Not Found's from the api
router.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

module.exports = router