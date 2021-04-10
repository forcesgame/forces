const express = require('express');

const router = express.Router();
const Force = require('../models/Force');
const Unit = require('../models/Unit');

const database = require('./database');

/**
 * Gets all forces
 */
router.get('/forces', async (req, res) => {
  try {
    const forces = await Force
      .find()
      .populate('user')
      .populate('units');

    if (forces.length === 0) {
      res.status(204);
      res.end();
    } else {
      res.send(forces);
    }
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
 * Gets a single force
 */
router.get('/forces/:userID', async (req, res) => {
  try {
    const force = await Force
      .findOne({ user: req.params.userID })
      .populate('user')
      .populate('units');

    if (force === null) {
      res.status(204);
      res.end();
    } else {
      res.send(force);
    }
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
 * Adds a starter force to a user's account
 * TODO validate that userID corresponds to a valid user
 */
router.post('/forces/:userID', async (req, res) => {
  try {
    const force = new Force({
      user: req.params.userID,
      units: database.generateDefaultUnits(),
    });

    await force.save();
    res.send(await Force
      .findOne({ user: req.params.userID })
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
 * Request body must contain the following fields:
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
    const force = await Force
      .findOne({ user: req.params.userID })
      .populate('user')
      .populate('units');

    if (force === null) {
      res.status(204);
      res.end();
    } else {
      if (req.body.units) {
        req.body.units.forEach(async (unit) => Unit.findOneAndUpdate(
          { _id: unit._id },
          { active: unit.active },
        ).catch((error) => console.error(error.message)));

        force.units = req.body.units;
      }

      await force.save();

      res.send(await Force
        .findOne({ user: req.params.userID })
        .populate('user')
        .populate('units'));
    }
  } catch (error) {
    res.status(400);
    res.send({
      type: 'https://forcesgame.com/probs/unspecified-problem',
      title: 'Unspecified problem',
    });
  }
});

module.exports = router;
