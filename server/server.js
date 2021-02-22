const express = require('express');
const fs = require('fs');
const {ApolloServer} = require('apollo-server-express')

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
}

function getUsers() {
  return userDB;
}

const app = express();
const server = new ApolloServer({
  typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
  resolvers
});

app.use('/', express.static('public'));
server.applyMiddleware({app, path:'/graphql'});
app.listen(3000, () => console.log('Forces server started on port 3000...'));