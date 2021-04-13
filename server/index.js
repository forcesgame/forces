const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// include router modules
const { database } = require('./routes/database');
const matches = require('./routes/matches');
const tiles = require('./routes/tiles');
const units = require('./routes/units');
const users = require('./routes/users');

dotenv.config();
const app = express();

// parse incoming requests with JSON payloads
app.use(express.json());

// serve static files
app.use(express.static(path.resolve(__dirname, '../client/build')));

// mount router modules
app.use('/api', database);
app.use('/api', matches);
app.use('/api', tiles);
app.use('/api', units);
app.use('/api', users);

// reroute remaining requests to client React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

// connect to MongoDB
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(5000, () => {
      console.log('API server listening on port 5000...');
    });
  });
