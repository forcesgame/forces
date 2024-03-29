const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// include router modules
const { database } = require('./routes/database');
const matches = require('./routes/matches');
const queue = require('./routes/queue');
const tiles = require('./routes/tiles');
const units = require('./routes/units');
const users = require('./routes/users');

dotenv.config();
const app = express();

// parse incoming requests with JSON payloads
app.use(express.json());

// serve static files
app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

// mount router modules
app.use('/api', database);
app.use('/api', matches);
app.use('/api', queue);
app.use('/api', tiles);
app.use('/api', units);
app.use('/api', users);

// reroute remaining requests to client React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
});

// connect to MongoDB
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`API server listening on port ${process.env.PORT ? process.env.PORT : '5000'}...`);
    });
  });
