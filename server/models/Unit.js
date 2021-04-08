const { model, Schema } = require('mongoose');

const unitSchema = Schema({
  health: {
    type: Number,
    default: 0,
  },
  stamina: {
    type: Number,
    default: 0,
  },
  type: {
    type: String,
    enum: ['BAZOOKA', 'INFANTRY', 'TANK'],
  },
});

module.exports = model('Unit', unitSchema);
