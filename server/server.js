require('dotenv').config();

const bcrypt = require('bcrypt');
const express = require('express');
const fs = require('fs');
const {ApolloServer} = require('apollo-server-express');
const {MongoClient} = require('mongodb');

const saltRounds = 10;
const mongoURL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}` +
  `@forces.wm1qz.mongodb.net/forces?retryWrites=true&w=majority`;

const userDB = [
  {
    userID: 1,
    username: 'patrick',
    email: 'patrick@gmail.com',
    password: 'password',
  },
  {
    userID: 2,
    username: 'test',
    email: 'test@gmail.com',
    password: 'test',
  }
];

let db;

const resolvers = {
  Query: {
    getUsers,
  },

  Mutation: {
    registerUser,
  }
}

async function getUsers() {
  return await db.collection('users').find({}).toArray();
}

function registerUser(_, {user}) {
  bcrypt.hash(user.password, saltRounds, (err, hash) => {
    user.password = hash;
  })

  userDB.push(user);

  return user;
}

const app = express();

const server = new ApolloServer({
  typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
  resolvers,
  formatError: error => {
    console.log(error);
    return error;
  }
});

async function connectToDb() {
  const client = new MongoClient(mongoURL, {useNewUrlParser: true});
  await client.connect();
  console.log(`Connected to MongoDB`);
  db = client.db();
}

app.use('/', express.static('public'));
server.applyMiddleware({app, path: '/graphql'});

(async () => {
  try {
    await connectToDb();
    app.listen(3000, () =>
      console.log('Forces server started on port 3000...'));
  } catch (err) {
    console.log(`Error: ${err}`);
  }
})();