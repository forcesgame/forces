const { model, Schema } = require('mongoose');

const forceDescriptionSchema = Schema({
  bazooka: {
    type: Number,
    default: 0,
  },
  infantry: {
    type: Number,
    default: 0,
  },
  tank: {
    type: Number,
    default: 0,
  },
});

const forceSchema = Schema({
  userID: Schema.Types.ObjectId,
  activeUnits: forceDescriptionSchema,
  inactiveUnits: forceDescriptionSchema,
});

forceSchema.index({ userID: 1 });

module.exports = {
  Force: model('Force', forceSchema),
  ForceDescription: model('ForceDescription', forceDescriptionSchema),
};
