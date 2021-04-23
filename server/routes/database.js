/* eslint-disable no-await-in-loop */
const express = require('express');

const router = express.Router();

const Match = require('../models/Match');
const Queue = require('../models/Queue');
const Tile = require('../models/Tile');
const Unit = require('../models/Unit');
const User = require('../models/User');

async function initializeUsers() {
  await User.deleteMany();

  const ben = new User({ username: 'ben' });
  const jesus = new User({ username: 'jesus' });
  const patrick = new User({ username: 'patrick' });
  const otherpatrick = new User({ username: 'otherpatrick' });

  await ben.save();
  await jesus.save();
  await patrick.save();
  await otherpatrick.save();
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
  const otherpatrick = await User.findOne({ username: 'otherpatrick' });

  await generateDefaultUnits(ben);
  await generateDefaultUnits(jesus);
  await generateDefaultUnits(patrick);
  await generateDefaultUnits(otherpatrick);
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

async function generateMatch(user1ID, user2ID) {
  const defaultColumnHeight = 8;

  const user1ActiveUnits = await Unit.find({ user: user1ID, active: true });
  const user2ActiveUnits = await Unit.find({ user: user2ID, active: true });
  const tiles = [];

  for (let i = 0; i < defaultColumnHeight; i += 1) {
    tiles.push(await generateTileRow());
  }

  const topRow = tiles[0];
  for (let i = 0; i < user1ActiveUnits.length; i += 1) {
    const tileID = topRow[i];
    const tile = await Tile.findById(tileID);
    tile.unit = user1ActiveUnits[i];
    await tile.save();
  }

  const bottomRow = tiles[7];
  for (let i = 0; i < user2ActiveUnits.length; i += 1) {
    const tileID = bottomRow[i];
    const tile = await Tile.findById(tileID);
    tile.unit = user2ActiveUnits[i];
    await tile.save();
  }

  const match = new Match({
    currentTurn: user1ID,
    user1: user1ID,
    user2: user2ID,
    inProgress: true,
    tiles,
    winner: null,
  });

  await match.save();
}

async function initializeMatches() {
  await Match.deleteMany();
}

async function initializeQueue() {
  await Queue.deleteMany();

  const queue = new Queue({
    users: [],
  });

  await queue.save();
}

router.post('/database/initialize', async (req, res) => {
  try {
    await initializeUsers();
    await initializeUnits();
    await initializeMatches();
    await initializeQueue();

    const users = await User.find();
    const units = await Unit.find();
    const matches = await Match.find();
    const queue = await Queue.findOne({});

    res.send({
      Users: users,
      Units: units,
      Matches: matches,
      Queue: queue,
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
  generateMatch,
};
