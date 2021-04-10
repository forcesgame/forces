const express = require('express');

const router = express.Router();
const User = require('../models/User');

/**
 * Gets all users
 */
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();

    if (users.length === 0) {
      res.status(204);
      res.end();
    } else {
      res.send(users);
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
 * Gets a single user
 */
router.get('/users/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (user === null) {
      res.status(204);
      res.end();
    } else {
      res.send(user);
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
 * Adds a user
 */
router.post('/users/:username', async (req, res) => {
  try {
    const user = new User({ username: req.params.username });
    await user.save();
    res.send(await User.findOne({ username: user.username }));
  } catch (error) {
    res.status(400);

    if (error.code === 11000) {
      res.send({
        type: 'https://forcesgame.com/probs/duplicate-username',
        title: 'Username already taken',
      });
    } else {
      res.send({
        type: 'https://forcesgame.com/probs/unspecified-problem',
        title: 'Unspecified problem',
        error,
      });
    }
  }
});

module.exports = router;
