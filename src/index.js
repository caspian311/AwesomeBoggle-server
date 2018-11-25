import 'babel-polyfill';

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const config = require('./config');
const users = require('./users');
const games = require('./games');

const app = express();

app.use(morgan(config.logging.level));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use('/users', users);
app.use('/games', games);

const server = app.listen(config.web.port, config.web.host, () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log(`Server running at http://${host}:${port}`);
});
