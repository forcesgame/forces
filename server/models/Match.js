const { model, Schema } = require('mongoose');

const matchSchema = Schema({
  currentTurn: { type: Schema.Types.ObjectId, ref: 'User' },
  user1: { type: Schema.Types.ObjectId, ref: 'User' },
  user2: { type: Schema.Types.ObjectId, ref: 'User' },
  inProgress: Boolean,
  map: [[{ type: Schema.Types.ObjectId, ref: 'Tile' }]],
  winner: { type: Schema.Types.ObjectId, ref: 'User' },
});

function populateMatch() {
  const defaultColumnHeight = 8;

  this.populate('currentTurn');
  this.populate('user1');
  this.populate('user2');
  for (let i = 0; i < defaultColumnHeight; i += 1) {
    this.populate(`map.${i}`);
  }
  this.populate('winner');
}

matchSchema.pre('find', populateMatch);
matchSchema.pre('findOne', populateMatch);

module.exports = model('Match', matchSchema);
