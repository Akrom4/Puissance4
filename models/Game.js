/* Game logic */

class Game {
    rows;
    columns;
    position;
    moveHistory; // Saves the last column played. From left to right starting with the index 1.
    turn; // Y for Yellow player || R for Red player (used to know whose turn it is and token color placement)
    winCondition;

    constructor(rows, columns) {
        this.rows = rows;
        this.columns = columns;
        this.winCondition = this.setWinCondition(this.columns, this.rows);
        this.position = [];
        this.moveHistory = [];

        for (let i = 0; i < this.columns; i++) {
            const column = [];
            for (let j = 0; j < this.rows; j++) {
                column.push(" ");
            }
            this.position.push(column);
        }
        this.turn = "Y";
    }

    playMove(colNum) {
        // Get the selected column
        const column = this.position[colNum];

        // Find the first empty slot in the column
        const emptySlotIndex = this.getEmptySlotIndex(column);
        if (emptySlotIndex !== -1) {
            // Place the token of the current player
            column[emptySlotIndex] = this.turn;
            const lastTurn = this.turn; // Save the color of the last turn
            this.moveHistory.push(colNum + 1);
            // Switch the turn to the other player
            this.switchTurn();
            return lastTurn;
        }
        else {
            return false;
        }
    }

    /* Win condition */

    checkWinCondition(lastTurn) {
        const lastMoveColumn = this.moveHistory[this.moveHistory.length - 1] -1; // Get the column of the last move
        const lastMoveRow = this.position[lastMoveColumn].lastIndexOf(this.turn === "Y" ? "R" : "Y"); // Get the row index of the last move
        
        // Check for a win condition
        const directions = [
            [-1, 0], // horizontal
            [0, -1], // vertical
            [-1, -1], // diagonal ↘
            [-1, 1], // diagonal ↗
        ];

        for (let [dx, dy] of directions) {
            let count = 0;
            let winningSequence = [];
            for (
                let offset = -this.winCondition - 1;
                offset <= this.winCondition + 1;
                offset++
            ) {
                let nx = lastMoveColumn + offset * dx;
                let ny = lastMoveRow + offset * dy;
                if (
                    nx >= 0 &&
                    nx < this.columns &&
                    ny >= 0 &&
                    ny < this.rows &&
                    this.position[nx][ny] === lastTurn
                ) {
                    count++;
                    winningSequence.push([nx, ny]);
                    if (count === this.winCondition) {
                        return winningSequence; // return the winning sequence
                    }
                } else {
                    count = 0;
                    winningSequence = []; // reset the sequence when the chain is broken
                }
            }
        }
        return false; // no winner
    }

    /* Set the number of aligned tokens to win the game */
    setWinCondition(x, y) {
        let win = Math.floor(Math.sqrt(x * y) - 2);
        return win;
    }
    undoMove() {
        // Only attempt to undo if there has been at least one move
        if (this.moveHistory.length > 0) {
            // Get the column of the last move
            const lastMoveColumn = this.moveHistory[this.moveHistory.length - 1] - 1;

            // Find the first non-empty slot in the column (from bottom to top)
            const column = this.position[lastMoveColumn];
            const filledSlotIndex = column.lastIndexOf(this.turn === "Y" ? "R" : "Y");

            // If found, empty the slot
            if (filledSlotIndex !== -1) {
                column[filledSlotIndex] = " ";
            }

            // Remove the last move from the history
            this.moveHistory.pop();

            // Switch the turn to the other player
            this.switchTurn();

        }
    }
    /* Switch turn */
    switchTurn() {
        this.turn = this.turn === "Y" ? "R" : "Y";
    }
    /* Returns the index of the first empty row 
    Returns -1 if the column is full */
    getEmptySlotIndex(column) {
        return column.indexOf(" ");
    }

    /* GETTERS */
    getWinCondition(){
        return this.winCondition;
    }

    getPosition() {
        return this.position;
    }

    getRows() {
        return this.rows;
    }

    getColumns() {
        return this.columns;
    }

    getTurn() {
        return this.turn;
    }

    /* DEBUG TOOLS */
    /* Display the board in console */
    toLog() {
        console.log("Current Board Position log :");
        for (let j = this.rows - 1; j >= 0; j--) {
            let row = "";
            for (let i = 0; i < this.columns; i++) {
                row += this.position[i][j] || " ";
                row += "\t";
            }
            console.log(row);
        }
    }

    /* Create a random position */
    testPosition() {
        for (let i = 0; i < this.columns; i++) {
            for (let j = 0; j < this.rows; j++) {
                const rand = Math.random();
                if (rand < 0.33) {
                    this.position[i][j] = " ";
                } else if (rand < 0.66) {
                    this.position[i][j] = "Y";
                } else {
                    this.position[i][j] = "R";
                }
            }
        }
    }
}
