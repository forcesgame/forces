const { model, Schema } = require('mongoose');

const mapSchema = Schema({
  tiles: [[{ type: Schema.Types.ObjectId, ref: 'Tile' }]],
});

module.exports = model('Map', mapSchema);
