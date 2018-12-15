const app = require('express').Router();

import Word from '../models/word';

app.get('/', allWords);

async function allWords(req, res) {
  try {
    let words = await Word.all();
    res.send(words);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

module.exports = app;
