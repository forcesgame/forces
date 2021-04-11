const { model, Schema } = require('mongoose');

const tileSchema = Schema({
  staminaCost: Number,
  type: {
    type: String,
    enum: ['PLAINS', 'ROAD', 'FOREST', 'MOUNTAINS'],
  },
  unit: { type: Schema.Types.ObjectId, ref: 'Unit' },
});

module.exports = model('Tile', tileSchema);
