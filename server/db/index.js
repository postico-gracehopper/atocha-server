const db = require('./db');
const User = require('.models/User');
const Post = require('.models/Post');


Post.belongsTo(User)
User.hasMany(Post)


module.exports = {
  db,
  models: {
    User,
    Post,
  },
};
