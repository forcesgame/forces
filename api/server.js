require('dotenv').config();

const bcrypt = require('bcrypt');
const express = require('express');
const fs = require('fs');
const { ApolloServer } = require('apollo-server-express');
const { MongoClient } = require('mongodb');

const saltRounds = 10;
const mongoURL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}`
  + '@forces.wm1qz.mongodb.net/forces?retryWrites=true&w=majority';

let db;

async function getUsers() {
  return db.collection('users').find({}).toArray();
}

async function registerUser(_, { user }) {
  const newUser = { ...user };

  newUser.password = await bcrypt.hash(user.password, saltRounds);

  const result = await db.collection('users').insertOne(newUser);

  return db.collection('users').findOne({ _id: result.insertId });
}

const resolvers = {
  Query: {
    getUsers,
  },

  Mutation: {
    registerUser,
  },
};

const app = express();

const server = new ApolloServer({
  typeDefs: fs.readFileSync('schema.graphql', 'utf-8'),
  resolvers,
  formatError: (error) => {
    console.log(error);
    return error;
  },
});

async function connectToDb() {
  const client = new MongoClient(mongoURL, { useNewUrlParser: true });
  await client.connect();
  console.log('Connected to MongoDB');
  db = client.db();
}

server.applyMiddleware({ app, path: '/graphql' });

const port = process.env.API_SERVER_PORT || 3000;

(async () => {
  try {
    await connectToDb();
    app.listen(port, () => console.log(`Forces API server started on port ${port}...`));
  } catch (err) {
    console.log(`Error: ${err}`);
  }
})();
