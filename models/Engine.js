/* Connect4 JavaScript Engine */

class Engine {
    constructor(game, level) {
      this.game = game;
      this.level = level;
    }
  
    /* 
    The AI selects a random valid column.
    */
    makeDecision() {
      let validColumns = [];
      for(let i = 0; i < this.game.getColumns(); i++) {
        if (this.game.getEmptySlotIndex(this.game.getPosition()[i]) !== -1) {
          validColumns.push(i);
        }
      }
      let randomColumnIndex = Math.floor(Math.random() * validColumns.length);
      return validColumns[randomColumnIndex];
    }
  }