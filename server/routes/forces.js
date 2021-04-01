const express = require('express');

const router = express.Router();
const { Force, ForceDescription } = require('../models/Force');
const User = require('../models/User');

/**
 * Gets all Forces
 */
router.get('/forces', async (req, res) => {
  res.send(await Force.find());
});

/**
 * Gets a single Force associated with a user
 */
router.get('/forces/:username', async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  const { _id } = user;

  res.send(await Force.findOne({ userID: _id }));
});

/**
 * Adds a default Force to be associated with a user
 * Request body must contain JSON of the username of the user to add:
 * {
 *   username: <insert-username-here>
 * }
 * TODO better error handling
 */
router.post('/forces', async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });
    const { _id } = user;

    const force = new Force({
      userID: _id,
      activeUnits: new ForceDescription(),
      inactiveUnits: new ForceDescription({
        bazooka: 3,
        infantry: 3,
        tank: 2,
      }),
    });

    await force.save();
    res.send(await Force.findOne({ userID: _id }));
  } catch (error) {
    res.status(400);
    res.send({
      type: 'https://forcesgame.com/probs/unspecified-problem',
      title: 'Unspecified problem',
    });
  }
});

/**
 * Updates a Force associated with a user
 * Request body must contain JSON of the username, activeUnits, and inactiveUnits:
 * {
 *   username: <insert-username here>,
 *   activeUnits: {
 *     bazooka: <insert-number-here>,
 *     infantry: <insert-number-here>,
 *     tank: <insert-number-here>
 *   },
 *   inactiveUnits: {
 *     bazooka: <insert-number-here>,
 *     infantry: <insert-number-here>,
 *     tank: <insert-number-here>
 *   }
 * }
 * TODO better error handling
 */
router.patch('/forces', async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });
    const { _id } = user;
    const force = await Force.findOne({ userID: _id });

    force.activeUnits = req.body.activeUnits;
    force.inactiveUnits = req.body.inactiveUnits;
    await force.save();

    res.send(await Force.findOne({ userID: _id }));
  } catch (error) {
    res.status(400);
    res.send({
      type: 'https://forcesgame.com/probs/unspecified-problem',
      title: 'Unspecified problem',
    });
  }
});

module.exports = router;
