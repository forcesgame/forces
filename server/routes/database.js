/* eslint-disable no-await-in-loop */
const express = require('express');

const router = express.Router();

const Match = require('../models/Match');
const Tile = require('../models/Tile');
const Unit = require('../models/Unit');
const User = require('../models/User');

async function initializeUsers() {
  await User.deleteMany();

  const ben = new User({ username: 'ben' });
  const jesus = new User({ username: 'jesus' });
  const patrick = new User({ username: 'patrick' });
  const otherPatrick = new User({ username: 'otherPatrick' });

  await ben.save();
  await jesus.save();
  await patrick.save();
  await otherPatrick.save();
}

async function generateDefaultUnits(user) {
  const defaultInfantryCount = 3;
  const defaultBazookaCount = 3;
  const defaultTankCount = 2;

  const units = [];

  for (let i = 0; i < defaultInfantryCount; i += 1) {
    const unit = new Unit({
      active: true,
      health: 100,
      maxHealth: 100,
      maxStamina: 3,
      rating: 1,
      stamina: 3,
      strongAgainst: ['BAZOOKA'],
      type: 'INFANTRY',
      user,
      weakAgainst: ['TANK'],
    });

    await unit.save();
    units.push(unit._id);
  }

  for (let i = 0; i < defaultBazookaCount; i += 1) {
    const unit = new Unit({
      active: false,
      health: 125,
      maxHealth: 125,
      maxStamina: 2,
      rating: 2,
      stamina: 2,
      strongAgainst: ['TANK'],
      type: 'BAZOOKA',
      user,
      weakAgainst: ['INFANTRY'],
    });

    await unit.save();
    units.push(unit._id);
  }

  for (let i = 0; i < defaultTankCount; i += 1) {
    const unit = new Unit({
      active: false,
      health: 200,
      maxHealth: 200,
      maxStamina: 1,
      rating: 3,
      stamina: 1,
      strongAgainst: ['INFANTRY'],
      type: 'TANK',
      user,
      weakAgainst: ['BAZOOKA'],
    });

    await unit.save();
    units.push(unit._id);
  }

  return units;
}

async function initializeUnits() {
  await Unit.deleteMany();

  const ben = await User.findOne({ username: 'ben' });
  const jesus = await User.findOne({ username: 'jesus' });
  const patrick = await User.findOne({ username: 'patrick' });
  const otherPatrick = await User.findOne({ username: 'otherPatrick' });

  await generateDefaultUnits(ben);
  await generateDefaultUnits(jesus);
  await generateDefaultUnits(patrick);
  await generateDefaultUnits(otherPatrick);
}

async function generateRandomTile(unit) {
  const types = ['PLAINS', 'ROAD', 'FOREST'];
  const staminaCosts = [1, 0.5, 2];
  const randomIndex = Math.floor(Math.random() * types.length);

  const tile = new Tile({
    staminaCost: staminaCosts[randomIndex],
    type: types[randomIndex],
    unit,
  });

  await tile.save();
  return tile;
}

async function generateTileRow() {
  const defaultRowWidth = 8;
  const row = [];

  for (let i = 0; i < defaultRowWidth; i += 1) {
    const tile = await generateRandomTile(null);
    row.push(tile._id);
  }

  return row;
}

async function initializeMatches() {
  const defaultColumnHeight = 8;

  await Match.deleteMany();

  const patrick = await User.findOne({ username: 'patrick' });
  const otherPatrick = await User.findOne({ username: 'otherPatrick' });
  const map = [];

  // TODO add active units to map

  for (let i = 0; i < defaultColumnHeight; i += 1) {
    map.push(await generateTileRow());
  }

  const match = new Match({
    currentTurn: patrick,
    user1: patrick,
    user2: otherPatrick,
    inProgress: true,
    map,
    winner: null,
  });

  await match.save();
}

router.post('/database/initialize', async (req, res) => {
  try {
    await initializeUsers();
    await initializeUnits();
    await initializeMatches();

    const users = await User.find();
    const units = await Unit.find()
      .populate('user');
    const matches = await Match.find();

    res.send({
      Users: users,
      Units: units,
      Matches: matches,
    });
  } catch (error) {
    res.status(400);
    res.send({
      type: 'https://forcesgame.com/probs/unspecified-problem',
      title: 'Unspecified problem',
      error,
    });
  }
});

module.exports = {
  database: router,
  generateDefaultUnits,
};
