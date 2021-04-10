const express = require('express');

const router = express.Router();
const Force = require('../models/Force');
const Unit = require('../models/Unit');
const User = require('../models/User');

async function initializeUsers() {
  await User.deleteMany();

  const ben = new User({ username: 'ben' });
  const jesus = new User({ username: 'jesus' });
  const patrick = new User({ username: 'patrick' });

  await ben.save();
  await jesus.save();
  await patrick.save();
}

function generateDefaultUnits() {
  const defaultInfantryCount = 3;
  const defaultBazookaCount = 3;
  const defaultTankCount = 2;

  const units = [];
  let unit;

  for (let i = 0; i < defaultInfantryCount; i += 1) {
    unit = new Unit({
      type: 'INFANTRY',
      health: 100,
      maxHealth: 100,
      maxStamina: 3,
      rating: 1,
      stamina: 2,
      strongAgainst: ['BAZOOKA'],
      weakAgainst: ['TANK'],
    });
    unit.save();
    units.push(unit._id);
  }

  for (let i = 0; i < defaultBazookaCount; i += 1) {
    unit = new Unit({
      type: 'BAZOOKA',
      health: 125,
      maxHealth: 125,
      maxStamina: 2,
      rating: 2,
      stamina: 2,
      strongAgainst: ['TANK'],
      weakAgainst: ['INFANTRY'],
    });
    unit.save();
    units.push(unit._id);
  }

  for (let i = 0; i < defaultTankCount; i += 1) {
    unit = new Unit({
      type: 'TANK',
      health: 200,
      maxHealth: 200,
      maxStamina: 1,
      rating: 3,
      stamina: 1,
      strongAgainst: ['INFANTRY'],
      weakAgainst: ['BAZOOKA'],
    });
    unit.save();
    units.push(unit._id);
  }

  return units;
}

async function initializeForces() {
  await Unit.deleteMany();
  await Force.deleteMany();

  const benID = await User.findOne({ username: 'ben' }, { _id: 1 });
  const benForce = new Force({
    user: benID,
    units: generateDefaultUnits(),
  });

  const jesusID = await User.findOne({ username: 'jesus' }, { _id: 1 });
  const jesusForce = new Force({
    user: jesusID,
    units: generateDefaultUnits(),
  });

  const patrickID = await User.findOne({ username: 'patrick' }, { _id: 1 });
  const patrickForce = new Force({
    user: patrickID,
    units: generateDefaultUnits(),
  });

  await benForce.save();
  await jesusForce.save();
  await patrickForce.save();
}

router.post('/database/initialize', async (req, res) => {
  try {
    await initializeUsers();
    await initializeForces();

    const users = await User
      .find();
    const forces = await Force
      .find()
      .populate('user')
      .populate('units');

    res.send({
      Users: users,
      Forces: forces,
    });
  } catch (error) {
    res.status(400);
    res.send({
      type: 'https://forcesgame.com/probs/unspecified-problem',
      title: 'Unspecified problem',
      error,
    });
  }
});

module.exports = {
  database: router,
  generateDefaultUnits,
};
