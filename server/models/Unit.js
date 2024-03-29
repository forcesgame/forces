const { model, Schema } = require('mongoose');

const unitSchema = Schema({
  active: {
    type: Boolean,
    default: false,
  },
  health: {
    type: Number,
    default: 0,
    min: 0,
    max: 200,
  },
  maxHealth: {
    type: Number,
    default: 100,
    min: 100,
    max: 200,
  },
  maxStamina: {
    type: Number,
    default: 1,
    min: 1,
    max: 3,
  },
  rating: {
    type: Number,
    default: 1,
    min: 1,
    max: 3,
  },
  stamina: {
    type: Number,
    default: 0,
    min: 0,
    max: 3,
  },
  strongAgainst: {
    type: [String],
  },
  type: {
    type: String,
    enum: ['BAZOOKA', 'INFANTRY', 'TANK'],
  },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  weakAgainst: {
    type: [String],
  },
});

function populateUnit() {
  this.populate('user');
}

unitSchema.pre('find', populateUnit);
unitSchema.pre('findOne', populateUnit);

module.exports = model('Unit', unitSchema);
