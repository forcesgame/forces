const { model, Schema } = require('mongoose');

const queueSchema = new Schema({
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { collection: 'queue' });

function populateQueue() {
  this.populate('users');
}

queueSchema.pre('findOne', populateQueue);

module.exports = model('Queue', queueSchema);
