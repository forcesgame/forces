const bcrypt = require('bcrypt');
const { getDb } = require('./db.js');

async function get() {
  const db = getDb();
  return db.collection('users').find({}).toArray();
}

async function register(_, { user }) {
  const newUser = { ...user };

  const saltRounds = 10;
  newUser.password = await bcrypt.hash(user.password, saltRounds);

  const db = getDb();
  const result = await db.collection('users').insertOne(newUser);

  return db.collection('users').findOne({ _id: result.insertId });
}

module.exports = { get, register };
