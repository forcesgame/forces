const express = require('express');
const path = require('path');

const app = express();

// serve static files
app.use(express.static(path.resolve(__dirname, '../client/build')));

// serve API requests
app.get('/api', (req, res) => {
  res.set('Content-Type', 'application/json');
  const response = { message: 'Hello, world!' };
  res.send(response);
});

// forward remaining requests to client React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
});

// start the server
app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Server listening on port 3000');
});
