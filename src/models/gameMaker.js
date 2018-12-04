const GRID_SIZE = 16;
const SAMPLE_SPACE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

class GameMaker {
  generateGrid() {
    var grid = "";

    for (var i = 0; i < GRID_SIZE; i++) {
      grid += SAMPLE_SPACE.charAt(Math.floor(Math.random() * SAMPLE_SPACE.length));
    }

    return grid;
  }
}

module.exports = GameMaker;
