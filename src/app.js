import 'babel-polyfill';

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');

const config = require('./config');
const users = require('./controllers/users');
const games = require('./controllers/games');
const words = require('./controllers/words');

const Authenticator = require('./authenticator');

const app = express();

app.use(morgan(config.logging.level));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(passport.initialize());
Authenticator.initialize();

let urlPrefix = `/api/v${config.apiVersion}`;

app.use(`${urlPrefix}/users`, users);
app.use(`${urlPrefix}/games`, games);
app.use(`${urlPrefix}/words`, words);

module.exports = app;
