/* eslint-disable no-underscore-dangle */
const express = require('express');

const router = express.Router();
const Force = require('../models/Force');
const Unit = require('../models/Unit');
const User = require('../models/User');

module.exports = router;

async function initializeUsers() {
  await User.deleteMany();

  const ben = new User({ username: 'ben', __v: 0 });
  const jesus = new User({ username: 'jesus', __v: 0 });
  const patrick = new User({ username: 'patrick', __v: 0 });

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
    unit = new Unit({ type: 'INFANTRY' });
    unit.save();
    units.push(unit._id);
  }

  for (let i = 0; i < defaultBazookaCount; i += 1) {
    unit = new Unit({ type: 'BAZOOKA' });
    unit.save();
    units.push(unit._id);
  }

  for (let i = 0; i < defaultTankCount; i += 1) {
    unit = new Unit({ type: 'TANK' });
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
    userID: benID,
    activeUnits: [],
    inactiveUnits: generateDefaultUnits(),
    __v: 0,
  });

  const jesusID = await User.findOne({ username: 'jesus' }, { _id: 1 });
  const jesusForce = new Force({
    userID: jesusID,
    activeUnits: [],
    inactiveUnits: generateDefaultUnits(),
    __v: 0,
  });

  const patrickID = await User.findOne({ username: 'patrick' }, { _id: 1 });
  const patrickForce = new Force({
    userID: patrickID,
    activeUnits: [],
    inactiveUnits: generateDefaultUnits(),
    __v: 0,
  });

  await benForce.save();
  await jesusForce.save();
  await patrickForce.save();
}

router.post('/database/initialize', async (req, res) => {
  try {
    await initializeUsers();
    await initializeForces();

    const users = await User.find();
    const forces = await Force.find();

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
