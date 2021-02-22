const bcrypt = require('bcrypt');
const express = require('express');
const fs = require('fs');
const {ApolloServer} = require('apollo-server-express')

const saltRounds = 10;

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

const resolvers = {
  Query: {
    getUsers,
  },

  Mutation: {
    registerUser,
  }
}

function getUsers() {
  return userDB;
}

function registerUser (_, {user}) {
  // TODO use more robust ID generation algorithm
  user.userID = userDB.length + 1;

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

app.use('/', express.static('public'));
server.applyMiddleware({app, path:'/graphql'});
app.listen(3000, () => console.log('Forces server started on port 3000...'));