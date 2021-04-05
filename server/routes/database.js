/* eslint-disable no-underscore-dangle */
const express = require('express');

const router = express.Router();
const { Force, ForceDescription } = require('../models/Force');
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

async function initializeForces() {
  await Force.deleteMany();

  const benId = User.findOne({ username: 'ben' })._id;
  const benForce = new Force({
    userId: benId,
    activeUnits: new ForceDescription({ bazooka: 0, infantry: 0, tank: 0 }),
    inactiveUnits: new ForceDescription({ bazooka: 3, infantry: 3, tank: 2 }),
    __v: 0,
  });

  const jesusId = User.findOne({ username: 'jesus' })._id;
  const jesusForce = new Force({
    userId: jesusId,
    activeUnits: new ForceDescription({ bazooka: 0, infantry: 0, tank: 0 }),
    inactiveUnits: new ForceDescription({ bazooka: 3, infantry: 3, tank: 2 }),
    __v: 0,
  });

  const patrickId = User.findOne({ username: 'ben' })._id;
  const patrickForce = new Force({
    userId: patrickId,
    activeUnits: new ForceDescription({ bazooka: 0, infantry: 0, tank: 0 }),
    inactiveUnits: new ForceDescription({ bazooka: 3, infantry: 3, tank: 2 }),
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
