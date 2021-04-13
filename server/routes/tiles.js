const express = require('express');

const router = express.Router();

const Tile = require('../models/Tile');

/**
 * Gets all tiles
 */
router.get('/tiles', async (req, res) => {
  try {
    const tiles = await Tile.find();

    if (!tiles || tiles.length === 0) {
      res.status(204);
      res.end();
    } else {
      res.send(tiles);
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
 * Gets a single tile
 */
router.get('/tiles/:id', async (req, res) => {
  try {
    /*
    we use findOne over findById as query middleware (necessary for pre hook
    population (see Tile.js)) is unsupported for findById
     */
    const tile = await Tile.findOne({ _id: req.params.id });

    if (!tile) {
      res.status(204);
      res.end();
    } else {
      res.send(tile);
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
 * Adds a tile
 * Request body should contain the following fields:
 * {
 *   staminaCost: <insert-number-here>,
 *   type: <insert-string-here>,
 *   unit: <insert-id-here OPTIONAL>,
 * }
 */
router.post('/tiles', async (req, res) => {
  if (!req.body.staminaCost || !req.body.type) {
    res.status(400);
    res.send({
      type: 'https://forcesgame.com/probs/missing-request-info',
      title: 'Request body missing required information',
    });
  }

  try {
    const tile = new Tile({
      staminaCost: req.body.staminaCost,
      type: req.body.type,
    });

    if (req.body.unit) {
      tile.unit = req.body.unit;
    } else {
      tile.unit = null;
    }

    await tile.save();

    /*
    we use findOne over findById as query middleware (necessary for pre hook
    population (see Tile.js)) is unsupported for findById
     */
    res.send(await Tile.findOne({ _id: tile._id }));
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
 * Updates a tile
 * Request body must contain the following field:
 * {
 *   unit: <insert-id-here OR null>
 * }
 */
router.patch('/tiles/:id', async (req, res) => {
  try {
    const tile = await Tile.findById(req.params.id);

    if (!tile) {
      res.status(400);
      res.send({
        type: 'https://forcesgame.com/probs/missing-resource',
        title: 'Resource to update missing',
      });
    }

    if (req.body.unit) {
      tile.unit = req.body.unit;
    } else {
      tile.unit = null;
    }

    await tile.save();

    /*
    we use findOne over findById as query middleware (necessary for pre hook
    population (see Tile.js)) is unsupported for findById
     */
    res.send(await Tile.findOne({ _id: tile._id }));
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
 * Deletes a tile
 */
router.delete('/tiles/:id', async (req, res) => {
  try {
    const tile = await Tile.findById(req.params.id);

    if (!tile) {
      res.status(400);
      res.send({
        type: 'https://forcesgame.com/probs/missing-resource',
        title: 'Resource to update missing',
      });
    }

    await Tile.deleteOne({ _id: tile._id });
    res.status(204);
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

module.exports = router;
