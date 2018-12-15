const conn = require('../db');

const allWordsSQL = `
  SELECT text
  FROM words
`;

class Word {
  static async all() {
    return await conn.query(allWordsSQL);
  }
}

module.exports = Word;
