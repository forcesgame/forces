const express = require('express');

const router = express.Router();
const User = require('../models/User');

/**
 * Gets all users
 */
router.get('/users', async (req, res) => {
  const users = await User.find();
  res.send(users);
});

/**
 * Gets a single user
 * TODO if no user found, change status code to 404
 */
router.get('/users/:username', async (req, res) => {
  const users = await User.findOne({ username: req.params.username });
  res.send(users);
});

/**
 * Adds a user
 * Request body must contain JSON of the username of the user to add:
 * {
 *   username: <insert-username-here>
 * }
 */
router.post('/users', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(400);
    res.send({
      type: 'https://forcesgame.com/probs/duplicate-username',
      title: 'Username already taken',
    });
  }
});

module.exports = router;
