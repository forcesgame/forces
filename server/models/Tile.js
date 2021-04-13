const { model, Schema } = require('mongoose');

const tileSchema = Schema({
  staminaCost: Number,
  type: {
    type: String,
    enum: ['PLAINS', 'ROAD', 'FOREST', 'MOUNTAINS'],
  },
  unit: { type: Schema.Types.ObjectId, ref: 'Unit' },
});

function populateTile() {
  this.populate('unit');
}

tileSchema.pre('find', populateTile);
tileSchema.pre('findOne', populateTile);

module.exports = model('Tile', tileSchema);
