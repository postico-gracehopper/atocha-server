'use strict'
const router = require('express').Router()
const { getAuth } = require('firebase-admin/auth')


router.use(async (req, res, next) => {
  try {
    const { auth } = req.headers
    if (!auth) throw new Error("Could not verify user: please include {headers: {auth: <GoogleIDTokenString>}} in request")
    const uid = await getAuth().verifyIdToken(auth)
    req.uid = uid
    next()
  } catch(err) {
    console.log(err)
    err.status = 403
    err.message = err.message || "Google firebase could not verify user"
    next(err)
  }
})


router.use('/checkDocker', require('./checkDocker'));
router.use('/generateVocab', require('./generateVocab'));
router.use('/generateTeacher', require('./generateTeacher'));
router.use('/generateSuggestions', require('./generateSuggestions'));
router.use('/translateString', require('./translateString'));

// catch all the Not Found's from the api
router.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

module.exports = router;
