const express = require('express');

const router = express.Router();

const Force = require('../models/Force');
const Map = require('../models/Map');
const Tile = require('../models/Tile');
const Unit = require('../models/Unit');
const User = require('../models/User');

async function initializeUsers() {
  await User.deleteMany();

  const ben = new User({ username: 'ben' });
  const jesus = new User({ username: 'jesus' });

  await ben.save();
  await jesus.save();
}

function generateDefaultUnits() {
  const defaultInfantryCount = 3;
  const defaultBazookaCount = 3;
  const defaultTankCount = 2;

  const units = [];
  let unit;

  for (let i = 0; i < defaultInfantryCount; i += 1) {
    unit = new Unit({
      type: 'INFANTRY',
      health: 100,
      maxHealth: 100,
      maxStamina: 3,
      rating: 1,
      stamina: 3,
      strongAgainst: ['BAZOOKA'],
      weakAgainst: ['TANK'],
    });

    unit.save();
    units.push(unit._id);
  }

  for (let i = 0; i < defaultBazookaCount; i += 1) {
    unit = new Unit({
      type: 'BAZOOKA',
      health: 125,
      maxHealth: 125,
      maxStamina: 2,
      rating: 2,
      stamina: 2,
      strongAgainst: ['TANK'],
      weakAgainst: ['INFANTRY'],
    });

    unit.save();
    units.push(unit._id);
  }

  for (let i = 0; i < defaultTankCount; i += 1) {
    unit = new Unit({
      type: 'TANK',
      health: 200,
      maxHealth: 200,
      maxStamina: 1,
      rating: 3,
      stamina: 1,
      strongAgainst: ['INFANTRY'],
      weakAgainst: ['BAZOOKA'],
    });

    unit.save();
    units.push(unit._id);
  }

  return units;
}

async function initializeForces() {
  await Unit.deleteMany();
  await Force.deleteMany();

  const benID = await User.findOne({ username: 'ben' }, { _id: 1 });
  const benForce = new Force({
    user: benID,
    units: generateDefaultUnits(),
  });

  const jesusID = await User.findOne({ username: 'jesus' }, { _id: 1 });
  const jesusForce = new Force({
    user: jesusID,
    units: generateDefaultUnits(),
  });

  await benForce.save();
  await jesusForce.save();
}

function generateTileRow() {
  const defaultRowWidth = 8;
  const types = ['PLAINS', 'ROAD', 'FOREST', 'MOUNTAINS'];
  const staminaCosts = [1, 0.5, 2, -1];

  const row = [];
  let tile;

  for (let i = 0; i < defaultRowWidth; i += 1) {
    const randomIndex = Math.floor(Math.random() * types.length);
    tile = new Tile({
      staminaCost: staminaCosts[randomIndex],
      type: types[randomIndex],
      unit: null,
    });

    tile.save();
    row.push(tile._id);
  }

  return row;
}

async function initializeMaps() {
  await Map.deleteMany();

  const defaultColumnHeight = 8;
  const rows = [];

  for (let i = 0; i < defaultColumnHeight; i += 1) {
    rows.push(generateTileRow());
  }

  const map = new Map({
    tiles: rows,
  });

  await map.save();
}

router.post('/database/initialize', async (req, res) => {
  try {
    await initializeUsers();
    await initializeForces();
    await initializeMaps();

    const users = await User.find();
    const forces = await Force.find()
      .populate('user')
      .populate('units');
    const units = await Unit.find();
    const maps = await Map.find()
      .populate('tiles.0')
      .populate('tiles.1')
      .populate('tiles.2')
      .populate('tiles.3')
      .populate('tiles.4')
      .populate('tiles.5')
      .populate('tiles.6')
      .populate('tiles.7');

    res.send({
      Users: users,
      Forces: forces,
      Units: units,
      Maps: maps,
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
