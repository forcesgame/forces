const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const users = require('./routes/users');

dotenv.config();
const app = express();
app.use(express.json());

// serve static files
app.use(express.static(path.resolve(__dirname, '../client/build')));

/*
serve API requests
for now, these are just examples of the main methods GET, POST, PUT, DELETE
 */
app.get('/api', (req, res) => {
  res.json({ request: 'GET /api' });
});

app.post('/api', (req, res) => {
  const input = req.body;
  res.json({
    request: 'POST /api',
    input,
  });
});

app.put('/api', (req, res) => {
  const input = req.body;
  res.json({
    request: 'PUT /api',
    input,
  });
});

app.delete('/api', (req, res) => {
  res.json({ request: 'DELETE /api' });
});

app.use('/api', users);

// reroute remaining requests to client React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve((__dirname, '../client/build', 'index.html')));
});

// connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(5000, () => {
      // eslint-disable-next-line no-console
      console.log('API server listening on port 5000...');
    });
  });
