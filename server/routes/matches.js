const express = require('express');

const router = express.Router();
const Match = require('../models/Match');

/**
 * Gets all matches
 */
router.get('/matches', async (req, res) => {
  try {
    const matches = await Match.find();

    if (!matches || matches.length === 0) {
      res.status(204);
      res.end();
    } else {
      res.send(matches);
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
 * Gets a single match
 */
router.get('/matches/:id', async (req, res) => {
  try {
    /*
    we use findOne over findById as query middleware (necessary for pre hook
    population (see Match.js)) is unsupported for findById
     */
    const match = await Match.findOne({ _id: req.params.id });

    if (!match) {
      res.status(204);
      res.end();
    } else {
      res.send(match);
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
 * Gets all matches associated with a user
 */
router.get('/matches/users/:userID', async (req, res) => {
  try {
    const matches = await Match.find({
      $or: [
        { user1: req.params.userID }, { user2: req.params.userID }],
    });

    if (matches.length === 0) {
      res.status(204);
      res.end();
    } else {
      res.send(matches);
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
