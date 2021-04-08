const { model, Schema } = require('mongoose');

const forceSchema = Schema({
  userID: Schema.Types.ObjectId,
  activeUnits: [],
  inactiveUnits: [],
});

forceSchema.index({ userID: 1 });

module.exports = model('Force', forceSchema);
