/* eslint-disable no-await-in-loop */
const express = require('express');

const router = express.Router();
const Match = require('../models/Match');
const Tile = require('../models/Tile');
const Utilities = require('./database');

/**
 * Gets all matches
 */
router.get('/matches', async (req, res) => {
  try {
    const matches = await Match.find();

    res.send(matches);
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

    res.send(match);
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
 * Gets match associated with a user
 */
router.get('/matches/users/:userID', async (req, res) => {
  try {
    const matches = await Match.find({
      $or: [
        { user1: req.params.userID }, { user2: req.params.userID }],
    });

    for (let i = 0; i < matches.length; i += 1) {
      if (matches[i].gameOverConfirmed.length < 2) {
        res.send(matches[i]);
        return;
      }
    }

    res.end();
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
 * Adds a match
 * If either user1 or user2 are already in a match, no changes will be made
 * Request body must contain the following fields:
 * {
 *   user1ID: <insert-id-here>,
 *   user2ID: <insert-id-here>
 * }
 */
router.post('/matches', async (req, res) => {
  try {
    await Utilities.generateMatch(req.body.user1ID, req.body.user2ID);
    const match = await Match.findOne({ user1: req.body.user1ID });
    res.send(match);
  } catch (error) {
    res.status(400);
    res.send({
      type: 'https://forcesgame.com/probs/unspecified-problem',
      title: 'Unspecified problem',
      error,
    });
  }
});

router.patch('/matches/:id', async (req, res) => {
  try {
    const match = await Match.findOne({ _id: req.params.id });

    if (!match) {
      res.status(400);
      res.send({
        type: 'https://forcesgame.com/probs/missing-resource',
        title: 'Resource to update missing',
      });
    }

    if (req.body.currentTurn) {
      match.currentTurn = req.body.currentTurn;
    }

    if (req.body.gameOverConfirmed) {
      const userIDToAdd = req.body.gameOverConfirmed;
      const gameOverConfirmedUserIDs = match.gameOverConfirmed.map((user) => user._id);

      if (!gameOverConfirmedUserIDs.includes(userIDToAdd)) {
        match.gameOverConfirmed.push(userIDToAdd);
      }
    }

    if (req.body.winner) {
      match.winner = req.body.winner;
    }

    // TODO only update tile if change occurred ("change differential")
    if (req.body.tiles) {
      const { tiles } = req.body;
      for (let i = 0; i < tiles.length; i += 1) {
        const tile = await Tile.findById(tiles[i]._id);
        tile.unit = tiles[i].unit;

        await tile.save();
      }
    }

    if (req.body.__v) {
      match.__v = req.body.__v;
    }

    await match.save();

    /*
    we use findOne over findById as query middleware (necessary for pre hook
    population (see Tile.js)) is unsupported for findById
     */
    res.send(await Match.findOne({ _id: req.params.id }));
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
