class Engine {
    game;
    level;
    maxDepth;

    constructor(game, level) {
        this.game = game;
        this.level = level;
        this.maxDepth = this.level * 2;
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
            console.log("minimax")
            let bestScore = -Infinity;
            let move;

            for (let i = 0; i < this.game.getColumns(); i++) {
                // Make a move
                this.game.playMove(i);
                let score = this.minimax(this.maxDepth, -Infinity, Infinity, false);
                // Undo the move
                this.game.undoMove();
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
            console.log(move);
            this.game.toLog();
            return move;
        }
    }


    /* MiniMax algorithm */
    minimax(depth, alpha, beta, maximizingPlayer) {
        // Get the current player and opponent before simulating a move
        let currentPlayer = this.game.getTurn();
        let opponentPlayer = this.game.getTurn() === "Y" ? "R" : "Y";
    
        // Clone the game
        let gameClone = this.game.clone();
        // If at terminal node or depth = 0, return heuristic value
        if (depth === 0 || gameClone.checkWinCondition() !== null) {
            return this.evaluate(gameClone, currentPlayer, opponentPlayer);
        }

    let columnOrder = this.middleFirstColumnOrder(gameClone.getColumns());

    if (maximizingPlayer) {
        let maxEval = -Infinity;
        for (let i of columnOrder) {
            // Check if the column is not full
            if (gameClone.getEmptySlotIndex(gameClone.getPosition()[i]) !== -1) {
                // Make a move on the cloned game
                gameClone.playMove(i);
                let evaluation = this.minimax(depth - 1, alpha, beta, false);
                // Undo the move on the cloned game
                gameClone.undoMove();
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
            if (gameClone.getEmptySlotIndex(gameClone.getPosition()[i]) !== -1) {
                // Make a move on the cloned game
                gameClone.playMove(i);
                let evaluation = this.minimax(depth - 1, alpha, beta, true);
                // Undo the move on the cloned game
                gameClone.undoMove();
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
            if (middle + offset < columns) {
                order.push(middle + offset);
            }
        }
        return order;
    }


    /* Heuristic evaluation function */
    evaluate(game, currentPlayer, opponentPlayer) {
        // If the AI wins, return 1
        if (game.checkWinCondition(currentPlayer)) {
            return 1;
        }
        // If the game is lost, return -1
        else if (game.checkWinCondition(opponentPlayer)) {
            return -1;
        }
        // If the game is not yet finished, return 0
        else {
            return 0;
        }
    }
}
