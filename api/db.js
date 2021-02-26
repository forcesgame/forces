require('dotenv').config();
const { MongoClient } = require('mongodb');

let db;

async function connectToDb() {
  const mongoURL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}`
    + '@forces.wm1qz.mongodb.net/forces?retryWrites=true&w=majority';
  const client = new MongoClient(mongoURL, { useNewUrlParser: true });
  await client.connect();
  console.log('Connected to MongoDB');
  db = client.db();
}

function getDb() {
  return db;
}

module.exports = { connectToDb, getDb };
