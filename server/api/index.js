'use strict'
const router = require('express').Router()
const { getAuth } = require('firebase-admin/auth')


router.use(async (req, res, next) => {
  console.log("here!")
  try {
    const { auth } = req.headers
    console.log('authorization', auth)
    const uid = await getAuth().verifyIdToken(auth)
    console.log(uid)
  } catch(err) {
    console.log(err)
    console.log("verify failed!!")
    err.status = 404
    err.message = "!! could not access using firebase"
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