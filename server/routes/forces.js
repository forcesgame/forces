const express = require('express');

const router = express.Router();
const Force = require('../models/Force');
const Unit = require('../models/Unit');

/**
 * Gets all Forces
 */
router.get('/forces', async (req, res) => {
  try {
    res.send(await Force.find()
      .populate('user')
      .populate('activeUnits')
      .populate('inactiveUnits'));
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
router.get('/forces/:id', async (req, res) => {
  try {
    const { id } = req.params;
    res.send(await Force
      .findOne({ user: id })
      .populate('user')
      .populate('activeUnits')
      .populate('inactiveUnits'));
  } catch (error) {
    res.status(400);
    res.send({
      type: 'https://forcesgame.com/probs/unspecified-problem',
      title: 'Unspecified problem',
      error,
    });
  }
});

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

/**
 * Adds a default Force to be associated with a user
 * Request body must contain JSON of the username of the user to add:
 * {
 *   username: <insert-username-here>
 * }
 */
router.post('/forces/:id', async (req, res) => {
  try {
    // TODO validate that id corresponds to a valid user
    const { id } = req.params;

    const force = new Force({
      user: id,
      activeUnits: [],
      inactiveUnits: generateDefaultUnits(),
    });

    await force.save();
    res.send(await Force.findOne({ user: id }));
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
 * Request body must contain JSON of the username, activeUnits, and inactiveUnits:
 * {
 *   username: <insert-username here>,
 *   activeUnits: [
 *     id,
 *     id,
 *     ...
 *   ],
 *   inactiveUnits: [
 *     id,
 *     id,
 *     ...
 *   ]
 * }
 */
router.patch('/forces/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const force = await Force.findOne({ user: id });

    if (req.body.activeUnits) {
      force.activeUnits = req.body.activeUnits;
    }

    if (req.body.inactiveUnits) {
      force.inactiveUnits = req.body.inactiveUnits;
    }

    await force.save();

    res.send(await Force.findOne({ user: id }));
  } catch (error) {
    res.status(400);
    res.send({
      type: 'https://forcesgame.com/probs/unspecified-problem',
      title: 'Unspecified problem',
    });
  }
});

module.exports = router;
