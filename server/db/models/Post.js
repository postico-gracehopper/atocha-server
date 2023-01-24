const Sequelize = require('sequelize');
const db = require('./db');

const Post = db.define('post', {
    name: {
        type: Sequelize.STRING,
    }
})

module.exports = Post;