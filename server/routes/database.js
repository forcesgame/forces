const express = require('express');

const router = express.Router();

const Force = require('../models/Force');
const Map = require('../models/Map');
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

function generateDefaultUnits() {
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
      weakAgainst: ['TANK'],
    });

    unit.save();
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
      weakAgainst: ['INFANTRY'],
    });

    unit.save();
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

  const patrickID = await User.findOne({ username: 'patrick' }, { _id: 1 });
  const patrickForce = new Force({
    user: patrickID,
    units: generateDefaultUnits(),
  });

  const otherPatrickID = await User.findOne(
    { username: 'otherPatrick' }, { _id: 1 },
  );
  const otherPatrickForce = new Force({
    user: otherPatrickID,
    units: generateDefaultUnits(),
  });

  await benForce.save();
  await jesusForce.save();
  await patrickForce.save();
  await otherPatrickForce.save();
}

function generateDefaultTile(unit) {
  const types = ['PLAINS', 'ROAD', 'FOREST', 'MOUNTAINS'];
  const staminaCosts = [1, 0.5, 2, -1];

  const randomIndex = Math.floor(Math.random() * types.length);
  const tile = new Tile({
    staminaCost: staminaCosts[randomIndex],
    type: types[randomIndex],
    unit,
  });

  tile.save();
  return tile;
}

function generateDefaultTileRow() {
  const defaultRowWidth = 8;

  const row = [];

  for (let i = 0; i < defaultRowWidth; i += 1) {
    const tile = generateDefaultTile(null);
    row.push(tile._id);
  }

  return row;
}

async function initializeMatches() {
  await Map.deleteMany();
  await Match.deleteMany();

  const patrickID = await User.findOne({ username: 'patrick' }, { _id: 1 });
  const otherPatrickID = await User.findOne(
    { username: 'otherPatrick' }, { _id: 1 },
  );

  const patrickForce = await Force
    .findOne({ user: patrickID })
    .populate('units');
  const otherPatrickForce = await Force
    .findOne({ user: otherPatrickID })
    .populate('units');

  const patrickActiveUnits = [];
  patrickForce.units.forEach((unit) => {
    if (unit.active) {
      patrickActiveUnits.push(unit._id);
    }
  });
  const otherPatrickActiveUnits = [];
  otherPatrickForce.units.forEach((unit) => {
    if (unit.active) {
      otherPatrickActiveUnits.push(unit._id);
    }
  });

  const defaultColumnHeight = 8;
  const rows = [];
  // top row: force1
  // TODO add patrickActiveUnits

  // middle rows: no units
  for (let i = 1; i < defaultColumnHeight - 1; i += 1) {
    rows.push(generateDefaultTileRow());
  }

  // bottom row: force2
  // TODO add otherPatrickActiveUnits

  const map = new Map({
    tiles: rows,
  });

  await map.save();

  const match = new Match({
    currentTurn: patrickID,
    force1: patrickForce,
    force2: otherPatrickForce,
    inProgress: true,
    map,
    winner: null,
  });

  await match.save();
}

router.post('/database/initialize', async (req, res) => {
  try {
    await initializeUsers();
    await initializeForces();
    await initializeMatches();

    const users = await User.find();
    const forces = await Force.find()
      .populate('user')
      .populate('units');
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

    res.send({
      Users: users,
      Forces: forces,
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
