const conn = require('./internalConnection');
const { promisify } = require('util');

conn.query = promisify(conn.query);

module.exports = conn;
