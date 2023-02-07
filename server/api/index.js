'use strict';
const router = require('express').Router();
// const { spawn } = require("node:child_process")

router.use('/checkDocker', require('./checkDocker'));
router.use('/generateVocab', require('./generateVocab'));
router.use('/generateTeacher', require('./generateTeacher'));
router.use('/generateSuggestions', require('./generateSuggestions'));

// catch all the Not Found's from the api
router.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

module.exports = router;
