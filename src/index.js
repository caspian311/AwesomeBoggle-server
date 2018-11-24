let express = require('express');
let app = express();

let bodyParser = require('body-parser');
let mysql = require('mysql');

let conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
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

app.get('/games', (req, res) => {
  let sql = `
    SELECT g.*
    FROM games g, scores s, users u
    WHERE g.finished = 0
    AND g.id = s.game_id
    and s.user_id = u.id
  `;
  conn.query(sql, (err, results) => {
    if (err) {
      throw err;
    }
    res.json(results);
  });

});

let server = app.listen(8080, () => {
  let host = server.address().address;
  let port = server.address().port;
  console.log(`Server running at http://${host}:${port}`);
});
