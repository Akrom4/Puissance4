class Engine {
  game;
  level;
  maxDepth;

  constructor(game, level) {
    this.game = game;
    this.level = level;
    this.maxDepth = 2;
  }

  /* 
    The Engine selects a move based on his level
    */
  makeDecision() {
    // Level 0 random play
    if (this.level === 1) {
      let validColumns = [];
      for (let i = 0; i < this.game.getColumns(); i++) {
        if (this.game.getEmptySlotIndex(this.game.getPosition()[i]) !== -1) {
          validColumns.push(i);
        }
      }
      let randomColumnIndex = Math.floor(Math.random() * validColumns.length);
      return validColumns[randomColumnIndex];
    }
    // For levels greater than 0, use Minimax algorithm
    else {
      let bestScore = -Infinity;
      let move;

      for (let i = 0; i < this.game.getColumns(); i++) {
        // Check if column is full
        if (this.game.getEmptySlotIndex(this.game.getPosition()[i]) === -1) {
          continue;
        }
        // Make a move
        this.game.playMove(i);
        let score = this.minimax(this.maxDepth, -Infinity, Infinity, true);
        // Undo the move
        this.game.undoMove();
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
      return move;
    }
  }

  /* MiniMax algorithm */
  minimax(depth, alpha, beta, maximizingPlayer) {
    // Get the current player and opponent before simulating a move
    let currentPlayer = this.game.getTurn() === "Y" ? "R" : "Y";

    // Clone the game
    // let gameClone = this.game.clone();

    // If at terminal node or depth = 0, return heuristic value
    if (depth === 0 || this.game.checkWinCondition() !== null) {
      return this.evaluate(this.game, currentPlayer);
    }

    let columnOrder = this.middleFirstColumnOrder(this.game.getColumns());
    if (maximizingPlayer) {
      let maxEval = -Infinity;
      for (let i of columnOrder) {
        // Check if the column is not full
        if (this.game.getEmptySlotIndex(this.game.getPosition()[i]) !== -1) {
          // Make a move on the cloned game
          this.game.playMove(i);
          let evaluation = this.minimax(depth - 1, alpha, beta, false);
          // Undo the move on the cloned game
          this.game.undoMove();
          maxEval = Math.max(maxEval, evaluation);
          alpha = Math.max(alpha, evaluation);
          // Alpha Beta Pruning
          if (beta <= alpha) {
            break;
          }
        }
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (let i of columnOrder) {
        // Check if the column is not full
        if (this.game.getEmptySlotIndex(this.game.getPosition()[i]) !== -1) {
          // Make a move on the cloned game
          this.game.playMove(i);
          let evaluation = this.minimax(depth - 1, alpha, beta, true);
          // Undo the move on the cloned game
          this.game.undoMove();
          minEval = Math.min(minEval, evaluation);
          beta = Math.min(beta, evaluation);
          // Alpha Beta Pruning
          if (beta <= alpha) {
            break;
          }
        }
      }
      return minEval;
    }
  }

  /* Column Order helper function */
  middleFirstColumnOrder(columns) {
    let order = [];
    let middle = Math.floor(columns / 2);
    for (let offset = 0; offset <= middle; offset++) {
      if (middle - offset >= 0) {
        order.push(middle - offset);
      }
      if (middle + offset < columns && offset !== 0) {
        order.push(middle + offset);
      }
    }
    return order;
  }

  /* Heuristic evaluation function */
evaluate(game, currentPlayer) {
    console.log("Evaluation :");
    
    let opponentPlayer = currentPlayer === "Y" ? "R" : "Y";
    
    // If the AI wins, return 1
    if (game.checkWinCondition(currentPlayer) !== null) {
    //   console.log("Currentplayer", currentPlayer);
    //   console.log("Position", game.position);
      if (currentPlayer == "R") {
        return 1;
      } else {
        return 0;
      }
    }
    // If the opponent wins, return -1
    else if (game.checkWinCondition(opponentPlayer) !== null) {
    //   console.log("OpponentPlayer", opponentPlayer);
    //   console.log("Position", game.position);
      if (opponentPlayer == "R") {
        return -1;
      } else {
        return 0;
      }
    }
    // If the game is not yet finished, return 0
    else {
      return 0;
    }
  }  
}
