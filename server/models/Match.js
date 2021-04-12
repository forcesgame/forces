const { model, Schema } = require('mongoose');

const matchSchema = Schema({
  currentTurn: { type: Schema.Types.ObjectId, ref: 'User' },
  force1: { type: Schema.Types.ObjectId, ref: 'Force' },
  force2: { type: Schema.Types.ObjectId, ref: 'Force' },
  inProgress: Boolean,
  map: { type: Schema.Types.ObjectId, ref: 'Map' },
  winner: { type: Schema.Types.ObjectId, ref: 'User' },
});

module.exports = model('Match', matchSchema);
