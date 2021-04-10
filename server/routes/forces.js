const express = require('express');

const router = express.Router();
const Force = require('../models/Force');
const Unit = require('../models/Unit');

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

/**
 * Gets all Forces
 */
router.get('/forces', async (req, res) => {
  try {
    res.send(await Force.find()
      .populate('user')
      .populate('units'));
  } catch (error) {
    res.status(400);
    res.send({
      type: 'https://forcesgame.com/probs/unspecified-problem',
      title: 'Unspecified problem',
      error,
    });
  }
});

/**
 * Gets a single Force associated with a user
 */
router.get('/forces/:userID', async (req, res) => {
  try {
    const { userID } = req.params;
    res.send(await Force
      .findOne({ user: userID })
      .populate('user')
      .populate('units'));
  } catch (error) {
    res.status(400);
    res.send({
      type: 'https://forcesgame.com/probs/unspecified-problem',
      title: 'Unspecified problem',
      error,
    });
  }
});

/**
 * Adds a default Force to be associated with a user
 */
router.post('/forces/:userID', async (req, res) => {
  try {
    // TODO validate that id corresponds to a valid user
    const { userID } = req.params;

    const force = new Force({
      user: userID,
      units: generateDefaultUnits(),
    });

    await force.save();
    res.send(await Force
      .findOne({ user: userID })
      .populate('user')
      .populate('units'));
  } catch (error) {
    res.status(400);
    res.send({
      type: 'https://forcesgame.com/probs/unspecified-problem',
      title: 'Unspecified problem',
      error,
    });
  }
});

/**
 * Updates a Force associated with a user
 * Request body must contain JSON of the units:
 * {
 *   units: [
 *     id,
 *     id,
 *     ...
 *   ]
 * }
 */
router.patch('/forces/:userID', async (req, res) => {
  try {
    const { userID } = req.params;
    const force = await Force.findOne({ user: userID });

    if (req.body.units) {
      force.units = req.body.units;
    }

    await force.save();

    res.send(await Force
      .findOne({ user: userID })
      .populate('user')
      .populate('units'));
  } catch (error) {
    res.status(400);
    res.send({
      type: 'https://forcesgame.com/probs/unspecified-problem',
      title: 'Unspecified problem',
    });
  }
});

module.exports = router;
