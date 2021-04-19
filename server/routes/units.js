const express = require('express');

const router = express.Router();
const Unit = require('../models/Unit');
const Utilities = require('./database');

/**
 * Gets all units
 */
router.get('/units', async (req, res) => {
  try {
    const units = await Unit.find();

    if (units.length === 0) {
      res.status(204);
      res.end();
    } else {
      res.send(units);
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
 * Gets a single unit
 */
router.get('/units/:id', async (req, res) => {
  try {
    /*
    we use findOne over findById as query middleware (necessary for pre hook
    population (see Unit.js)) is unsupported for findById
     */
    const unit = await Unit.findOne({ _id: req.params.id })
      .populate('user');

    if (unit === null) {
      res.status(204);
      res.end();
    } else {
      res.send(unit);
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
 * Gets all units associated with a user
 */
router.get('/units/users/:userID', async (req, res) => {
  try {
    const units = await Unit.find({ user: req.params.userID });

    if (units.length === 0) {
      res.status(204);
      res.end();
    } else {
      res.send(units);
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
 * Adds a starter set of units to be associated with a user
 */
router.post('/units/users/:userID', async (req, res) => {
  try {
    await Utilities.generateDefaultUnits(req.params.userID);
    const units = await Unit.find({ user: req.params.userID });

    res.send(units);
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
 * Updates a Unit
 * Request body may contain the following fields:
 * {
 *   active: <insert-boolean-here OPTIONAL>,
 *   health: <insert-number-here OPTIONAL>,
 *   stamina: <insert-number-here OPTIONAL>
 * }
 */
router.patch('/units/:id', async (req, res) => {
  try {
    const unit = await Unit.findOne({ _id: req.params.id });

    if (unit === null) {
      res.status(204);
      res.end();
    } else {
      if ('active' in req.body) {
        unit.active = req.body.active;
      }

      if ('health' in req.body) {
        unit.health = req.body.health;
      }

      if ('stamina' in req.body) {
        unit.stamina = req.body.stamina;
      }

      await unit.save();

      res.send(await Unit.findOne({ _id: req.params.id }).populate('user'));
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

module.exports = router;
