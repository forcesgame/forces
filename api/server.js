require('dotenv').config();

const express = require('express');
const { connectToDb } = require('./db.js');
const { installHandler } = require('./api-handler.js');

const app = express();

installHandler(app);

const port = process.env.API_SERVER_PORT || 3000;

(async () => {
  try {
    await connectToDb();
    app.listen(port, () => console.log(`Forces API server started on port ${port}...`));
  } catch (err) {
    console.log(`Error: ${err}`);
  }
})();
