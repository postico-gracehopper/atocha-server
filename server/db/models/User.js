const { Sequelize, Op } = require('sequelize');
const db = require('../db');


const User = db.define('user', {
    name: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
});


module.exports = User;