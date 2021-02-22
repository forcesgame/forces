const express = require('express');
const app = express();

app.use('/', express.static('public'));
app.listen(3000, () => console.log('Forces server started on port 3000...'));