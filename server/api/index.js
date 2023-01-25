'use strict'
const router = require('express').Router()

router.use('/translate', require('./translate'))
// router.use('/posts', require('./posts'))


// catch all errors from the api
router.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

module.exports = router