const express = require('express');

const router = express.Router();
const User = require('../models/User');

router.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

router.get('/users/:username', async (req, res) => {
  const users = await User.findOne({ username: req.params.username });
  res.json(users);
});

module.exports = router;
