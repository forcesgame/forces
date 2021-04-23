const express = require('express');

const router = express.Router();
const Queue = require('../models/Queue');

router.get('/queue', async (req, res) => {
  try {
    const queue = await Queue.findOne({});

    res.send(queue);
  } catch (error) {
    res.status(400);
    res.send({
      type: 'https://forcesgame.com/probs/unspecified-problem',
      title: 'Unspecified problem',
      error,
    });
  }
});

router.post('/queue/users/:userID', async (req, res) => {
  try {
    const queue = await Queue.findOne({});
    const userIndex = queue.users.findIndex((queueUser) => (
      JSON.stringify(queueUser._id) === JSON.stringify(req.params.userID)
    ));

    if (userIndex === -1) {
      queue.users.push(req.params.userID);
      await queue.save();
    }

    const updatedQueue = await Queue.findOne({});

    res.send(updatedQueue);
  } catch (error) {
    res.status(400);
    res.send({
      type: 'https://forcesgame.com/probs/unspecified-problem',
      title: 'Unspecified problem',
      error,
    });
  }
});

router.delete('/queue/users/:userID', async (req, res) => {
  try {
    const queue = await Queue.findOne({});
    const userIndex = queue.users.findIndex((queueUser) => (
      JSON.stringify(queueUser._id) === JSON.stringify(req.params.userID)
    ));

    if (userIndex !== -1) {
      queue.users.splice(userIndex, 1);
      await queue.save();
    }

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
