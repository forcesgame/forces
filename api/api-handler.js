const fs = require('fs');
const { ApolloServer } = require('apollo-server-express');
const user = require('./user');

const resolvers = {
  Query: {
    getUsers: user.get,
  },

  Mutation: {
    registerUser: user.register,
  },
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync('schema.graphql', 'utf-8'),
  resolvers,
  formatError: (error) => {
    console.log(error);
    return error;
  },
});

function installHandler(app) {
  server.applyMiddleware({ app, path: '/graphql' });
}

module.exports = { installHandler };
