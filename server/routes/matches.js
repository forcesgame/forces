const express = require('express');

const router = express.Router();
const Match = require('../models/Match');

/**
 * Gets all matches
 */
router.get('/matches', async (req, res) => {
  try {
    const matches = await Match.find()
      .populate('currentTurn')
      .populate({ path: 'force1', populate: { path: 'user' } })
      .populate({ path: 'force1', populate: { path: 'units' } })
      .populate({ path: 'force2', populate: { path: 'user' } })
      .populate({ path: 'force2', populate: { path: 'units' } })
      .populate({ path: 'map', populate: { path: 'tiles.0' } })
      .populate({ path: 'map', populate: { path: 'tiles.1' } })
      .populate({ path: 'map', populate: { path: 'tiles.2' } })
      .populate({ path: 'map', populate: { path: 'tiles.3' } })
      .populate({ path: 'map', populate: { path: 'tiles.4' } })
      .populate({ path: 'map', populate: { path: 'tiles.5' } })
      .populate({ path: 'map', populate: { path: 'tiles.6' } })
      .populate({ path: 'map', populate: { path: 'tiles.7' } })
      .populate({ path: 'winner', populate: { path: 'user' } });

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
 * Gets a single matche
 */
router.get('/matches/:id', async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate('currentTurn')
      .populate({ path: 'force1', populate: { path: 'user' } })
      .populate({ path: 'force1', populate: { path: 'units' } })
      .populate({ path: 'force2', populate: { path: 'user' } })
      .populate({ path: 'force2', populate: { path: 'units' } })
      .populate({ path: 'map', populate: { path: 'tiles.0' } })
      .populate({ path: 'map', populate: { path: 'tiles.1' } })
      .populate({ path: 'map', populate: { path: 'tiles.2' } })
      .populate({ path: 'map', populate: { path: 'tiles.3' } })
      .populate({ path: 'map', populate: { path: 'tiles.4' } })
      .populate({ path: 'map', populate: { path: 'tiles.5' } })
      .populate({ path: 'map', populate: { path: 'tiles.6' } })
      .populate({ path: 'map', populate: { path: 'tiles.7' } })
      .populate({ path: 'winner', populate: { path: 'user' } });

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
module.exports = router;
