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

  const patrick = new User({ username: 'patrick' });
  const otherpatrick = new User({ username: 'otherpatrick' });

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

  const patrick = await User.findOne({ username: 'patrick' });
  const otherpatrick = await User.findOne({ username: 'otherpatrick' });

  await generateDefaultUnits(patrick);
  await generateDefaultUnits(otherpatrick);
}

async function generateRandomTile(unit, row, col) {
  const types = ['PLAINS', 'ROAD', 'FOREST'];
  const staminaCosts = [1, 0.5, 2];
  const randomIndex = Math.floor(Math.random() * types.length);

  const tile = new Tile({
    staminaCost: staminaCosts[randomIndex],
    type: types[randomIndex],
    unit,
    x: col,
    y: row,
  });

  await tile.save();
  return tile;
}

async function generateTileRow(rowIndex) {
  const defaultRowWidth = 8;
  const row = [];

  for (let i = 0; i < defaultRowWidth; i += 1) {
    const tile = await generateRandomTile(null, rowIndex, i);
    row.push(tile._id);
  }

  return row;
}

function shuffle(units) {
  const _units = [...units];
  for (let i = _units.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = _units[i];
    _units[i] = _units[j];
    _units[j] = temp;
  }

  return _units;
}

async function generateMatch(user1ID, user2ID) {
  const defaultColumnHeight = 8;

  let user1ActiveUnits = await Unit.find({ user: user1ID, active: true });
  let user2ActiveUnits = await Unit.find({ user: user2ID, active: true });

  for (let i = 0; i < user1ActiveUnits.length; i += 1) {
    user1ActiveUnits[i].health = user1ActiveUnits[i].maxHealth;
    user1ActiveUnits[i].stamina = user1ActiveUnits[i].maxStamina;

    await user1ActiveUnits[i].save();
  }

  for (let i = 0; i < user2ActiveUnits.length; i += 1) {
    user2ActiveUnits[i].health = user2ActiveUnits[i].maxHealth;
    user2ActiveUnits[i].stamina = user2ActiveUnits[i].maxStamina;

    await user2ActiveUnits[i].save();
  }

  user1ActiveUnits = shuffle(user1ActiveUnits);
  user2ActiveUnits = shuffle(user2ActiveUnits);

  const tiles = [];

  for (let i = 0; i < defaultColumnHeight; i += 1) {
    tiles.push(await generateTileRow(i));
  }

  const topRow = tiles[0];
  const firstToTopRow = tiles[1];

  let user1RemainingUnitCount = user1ActiveUnits.length;

  while (user1RemainingUnitCount > 0) {
    const randomIndex = Math.floor(Math.random() * 8);
    const rowIndex = Math.floor(Math.random() * 2);

    let tileID;

    if (rowIndex === 0) {
      tileID = topRow[randomIndex];
    } else {
      tileID = firstToTopRow[randomIndex];
    }

    const tile = await Tile.findById(tileID);

    if (!tile.unit) {
      tile.unit = user1ActiveUnits[user1RemainingUnitCount - 1];
      await tile.save();
      user1RemainingUnitCount -= 1;
    }
  }

  const firstToBottomRow = tiles[6];
  const bottomRow = tiles[7];

  let user2RemainingUnitCount = user2ActiveUnits.length;

  while (user2RemainingUnitCount > 0) {
    const randomIndex = Math.floor(Math.random() * 8);
    const rowIndex = Math.floor(Math.random() * 2);

    let tileID;

    if (rowIndex === 0) {
      tileID = bottomRow[randomIndex];
    } else {
      tileID = firstToBottomRow[randomIndex];
    }

    const tile = await Tile.findById(tileID);

    if (!tile.unit) {
      tile.unit = user2ActiveUnits[user2RemainingUnitCount - 1];
      await tile.save();
      user2RemainingUnitCount -= 1;
    }
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

  // ensure users are definitely removed from the queue
  const queue = await Queue.findOne({});
  const user1Index = queue.users.findIndex((queueUser) => (
    JSON.stringify(queueUser._id) === JSON.stringify(user1ID)
  ));
  const user2Index = queue.users.findIndex((queueUser) => (
    JSON.stringify(queueUser._id) === JSON.stringify(user2ID)
  ));

  if (user1Index !== -1) {
    queue.users.splice(user1Index, 1);
    await queue.save();
  }

  if (user2Index !== -1) {
    queue.users.splice(user2Index, 1);
    await queue.save();
  }
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
