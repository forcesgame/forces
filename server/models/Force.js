const { model, Schema } = require('mongoose');

const unitSchema = Schema({
  type: {
    type: String,
    enum: ['INFANTRY', 'BAZOOKA', 'TANK'],
  },
  health: {
    type: Number,
    min: 0,
    max: 100,
  },
});

const forceSchema = Schema({
  userID: Schema.Types.ObjectId,
  activeUnits: [unitSchema],
  inactiveUnits: [unitSchema],
});

forceSchema.index({ userID: 1 });

module.exports = model('Force', forceSchema);
