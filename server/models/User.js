const { model, Schema } = require('mongoose');

const userSchema = Schema({
  username: {
    type: String,
    unique: true,
  },
});

userSchema.index({ username: 1 });

module.exports = model('User', userSchema);
