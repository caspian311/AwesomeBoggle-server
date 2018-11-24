let express = require('express');
let app = express();

let bodyParser = require('body-parser');
let mysql = require('mysql');

let conn = mysql.createConnection({
  host: "localhost",
  user: "awesomeboggle",
  password: "awesomeboggle",
  database: "awesomeboggle"
});

conn.connect((err) => {
  if (err) {
    throw err;
  }

  console.log("Database connection made");
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.get('/availableUsers', (req, res) => {
  let sql = `
    SELECT u.*
    FROM users u
    WHERE u.id NOT IN (
      SELECT u.id
      FROM users u, games g, scores s
      WHERE s.game_id = g.id
      AND s.user_id = u.id
      AND g.finished = 0
    )
  `;
  conn.query(sql, (err, results) => {
    if (err) {
      throw err;
    }
    res.json(results);
  });
});

app.post('/joinGame', (req, res) => {
  let gameMembers = req.body["user_ids"];

  let createGameSql = `
    INSERT INTO games (created_on, finished)
      values (NOW(), 0)
  `;
  conn.query(createGameSql, (err, results) => {
    if (err) {
      throw err;
    }

    let gameId = results.insertId;

    let createScore = `INSERT INTO scores (game_id, user_id, score) VALUES ?`;
    let scoreData = gameMembers.map(memberId => [gameId, memberId, 0]);
    conn.query(createScore, [scoreData], (err, results) => {
      if (err) {
        throw err;
      }

      res.json({ game: { id: gameId } })
    });
  });
});

let server = app.listen(8080, () => {
  let host = server.address().address;
  let port = server.address().port;
  console.log(`Server running at http://${host}:${port}`);
});
