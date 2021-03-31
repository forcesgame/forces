const mongoose = require('mongoose');

const schema = mongoose.Schema({
  username: String,
});

module.exports = mongoose.model('User', schema);
