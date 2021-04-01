const express = require('express');

const router = express.Router();
const { Force, ForceDescription } = require('../models/Force');
const User = require('../models/User');

/**
 * Gets all Forces
 */
router.get('/forces', async (req, res) => {
  const forces = await Force.find();
  res.send(forces);
});

/**
 * Gets a single Force associated with a user
 */
router.get('/forces/:username', async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  const { _id } = user;
  const force = await Force.findOne({ userID: _id });
  res.send(force);
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

module.exports = router;
