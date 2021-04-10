const { model, Schema } = require('mongoose');

const forceSchema = Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  units: [{ type: Schema.Types.ObjectId, ref: 'Unit' }],
});

module.exports = model('Force', forceSchema);
