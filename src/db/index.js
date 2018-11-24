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

module.exports = conn;
