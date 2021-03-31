const express = require('express');

const router = express.Router();
const Force = require('../models/Force');
const User = require('../models/User');

router.get('/forces', async (req, res) => {
  const forces = await Force.find();
  res.json(forces);
});

router.get('/forces/:username', async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  const { _id } = user;
  const force = await Force.findOne({ userID: _id });
  res.json(force);
});

module.exports = router;
