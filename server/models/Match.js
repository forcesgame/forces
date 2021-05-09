const { model, Schema } = require('mongoose');

const matchSchema = Schema({
  currentTurn: { type: Schema.Types.ObjectId, ref: 'User' },
  gameOverConfirmed: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  tiles: [[{ type: Schema.Types.ObjectId, ref: 'Tile' }]],
  user1: { type: Schema.Types.ObjectId, ref: 'User' },
  user2: { type: Schema.Types.ObjectId, ref: 'User' },
  winner: { type: Schema.Types.ObjectId, ref: 'User' },
});

function populateMatch() {
  const defaultColumnHeight = 8;

  this.populate('currentTurn');
  this.populate(`gameOverConfirmed.${0}`);
  this.populate(`gameOverConfirmed.${1}`);
  for (let i = 0; i < defaultColumnHeight; i += 1) {
    this.populate(`tiles.${i}`);
  }
  this.populate('user1');
  this.populate('user2');
  this.populate('winner');
}

matchSchema.pre('find', populateMatch);
matchSchema.pre('findOne', populateMatch);

module.exports = model('Match', matchSchema);
