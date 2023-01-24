'use strict'
const router = require('express').Router()

router.use('/translate', require('./translate'))
// router.use('/posts', require('./posts'))


// catch all errors from the api
router.use((err, req, res, next) => {
  res.status(400).send({message: err.message})
})

module.exports = router