const { model, Schema } = require('mongoose');

const forceDescription = Schema({
  bazooka: Number,
  infantry: Number,
  tank: Number,
});

const forceSchema = Schema({
  userID: Schema.Types.ObjectId,
  activeUnits: forceDescription,
  inactiveUnits: forceDescription,
});

forceSchema.index({ userID: 1 });

module.exports = model('Force', forceSchema);
