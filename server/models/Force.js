const { model, Schema } = require('mongoose');

const forceSchema = Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  activeUnits: [{ type: Schema.Types.ObjectId, ref: 'Unit' }],
  inactiveUnits: [{ type: Schema.Types.ObjectId, ref: 'Unit' }],
});

forceSchema.index({ user: 1 });

module.exports = model('Force', forceSchema);
