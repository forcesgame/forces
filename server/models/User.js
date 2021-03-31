const { model, Schema } = require('mongoose');

const userSchema = Schema({
  username: String,
});

userSchema.index({ username: 1 });

module.exports = model('User', userSchema);
