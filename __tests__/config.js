const conn = require('../src/db');

module.exports = () => {
  conn.end();
}
