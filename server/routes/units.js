const express = require('express');

const router = express.Router();
const Unit = require('../models/Unit');

/**
 * Gets all Units
 */
router.get('/units', async (req, res) => {
  try {
    res.send(await Unit.find());
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
 * Gets a single Unit associated with an id
 */
router.get('/units/:id', async (req, res) => {
  try {
    const { id } = req.params;
    res.send(await Unit.findOne({ _id: id }));
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
 * Request body may contain the new health, new stamina, both, or neither:
 * {
 *   active: <insert-boolean-here OPTIONAL>
 *   health: <insert-number-here OPTIONAL>,
 *   stamina: <insert-number-here OPTIONAL>
 * }
 */
router.patch('/units/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const unit = await Unit.findOne({ _id: id });

    if (req.body.active) {
      unit.active = req.body.active;
    }

    if (req.body.health) {
      unit.health = req.body.health;
    }

    if (req.body.stamina) {
      unit.stamina = req.body.stamina;
    }

    await unit.save();

    res.send(await Unit.findOne({ _id: id }));
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
