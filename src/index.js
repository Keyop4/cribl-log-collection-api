const express = require('express');
const routes = require('./routes/index.js');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }
// Initialize express
const app = express();
const PORT = process.env.PORT || 5000;
// parse JSON
app.use(express.json());
// parse URL encoded data
app.use(express.urlencoded({ extended: true }));

// * Routes * //
app.use('/logs', routes.log);

// create a server
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});
