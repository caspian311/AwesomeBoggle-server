const mysql = require('mysql');
const config = require('../config');

let conn = mysql.createConnection({
  host: config.db.host,
  port: config.db.port,
  user: config.db.username,
  password: config.db.password,
  database: config.db.database
});


conn.connect((err) => {
  if (err) {
    throw err;
  }

  console.log("Database connection made");
});

// TODO: fix this so the tests can still run w/ it
// conn.on('error', function(err) {
//   console.log("[mysql error]", err);
//   throw err;
// });

module.exports = conn;
