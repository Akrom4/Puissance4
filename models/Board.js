// Handling of the game

class Board {
  rows;
  columns;
  position;
  turn; // Y for Yellow player || R for Red player
  winCondition;
  audio;
  moveSound;

  constructor(rows, columns, audio = true, level = "0", turn = "Y") {
    this.rows = rows;
    this.columns = columns;
    this.winCondition = this.setWinCondition(this.columns, this.rows);
    this.position = [];
    this.audio = audio;
    if (this.audio) {
      this.loadSound();
    }
    this.level = level;

    for (let i = 0; i < this.columns; i++) {
      const column = [];
      for (let j = 0; j < this.rows; j++) {
        column.push(" ");
      }
      this.position.push(column);
    }
    this.turn = turn;
    this.addMouseOverEvents();
  }

  loadSound() {
    this.moveSound = new Audio("audio/move-sound.mp3");
    this.moveSound.onerror = function () {
      console.log("Error loading audio file");
    };
  }

  /* Try to play a move */

  playMove(colNum) {
    // Get the selected column
    const column = this.position[colNum];

    // Find the first empty slot in the column
    const emptySlotIndex = this.getEmptySlotIndex(column);
    if (emptySlotIndex !== -1) {
      // Place the token of the current player
      column[emptySlotIndex] = this.turn;

      // Check for a win condition
      if (this.checkWinCondition(colNum, emptySlotIndex)) {
        console.log("Player " + this.turn + " wins!");
        // Stop the game by redrawing the board without the eventlisteners
        document.getElementById("app").innerHTML = this.toHTML();
      } else {
        // Switch the turn to the other player
        this.turn = this.turn === "Y" ? "R" : "Y";
        // this.audio ? this.moveSound.play() : null;
        if (this.audio) {
          this.moveSound.play().catch(function (error) {
            console.log("Error playing audio file");
          });
        }
        // Redraw the board
        document.getElementById("app").innerHTML = this.toHTML();
        this.addMouseOverEvents();
      }
    }
  }

  /* Win condition */

  checkWinCondition(colNum, rowNum) {
    const directions = [
      [-1, 0], // horizontal -
      [0, -1], // vertical   |
      [-1, -1], // diagonal  \
      [-1, 1], // diagonal   /
    ];

    for (let [dx, dy] of directions) {
      let count = 0;
      for (
        let offset = -this.winCondition - 1;
        offset <= this.winCondition + 1;
        offset++
      ) {
        let nx = colNum + offset * dx;
        let ny = rowNum + offset * dy;
        if (
          nx >= 0 &&
          nx < this.columns &&
          ny >= 0 &&
          ny < this.rows &&
          this.position[nx][ny] === this.turn
        ) {
          count++;
          if (count === this.winCondition) {
            return true; // we have a winner!
          }
        } else {
          count = 0;
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

  /* Add mouse events to the board */
  handleMouseOver(column) {
    const currentPlayer = this.getTurn();
    const upperSquare = column.getElementsByClassName("upperSquare")[0];
    if (currentPlayer === "Y") {
      upperSquare.innerHTML = '<div class="yellowSquare"></div>';
    } else if (currentPlayer === "R") {
      upperSquare.innerHTML = '<div class="redSquare"></div>';
    }
  }

  handleMouseOut(column) {
    const upperSquare = column.getElementsByClassName("upperSquare")[0];
    upperSquare.innerHTML = '<div class="emptySquare"></div>';
  }

  handleClick(i) {
    this.playMove(i);
  }

  addMouseOverEvents() {
    const columns = document.getElementsByClassName("column");

    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      // Add events only if the column isn't full
      if (this.getEmptySlotIndex(this.position[i]) !== -1) {
        // Make the token appear when hovering a column
        column.addEventListener("mouseover", () =>
          this.handleMouseOver(column)
        );
        // Reset the upper square when the mouse leaves the column
        column.addEventListener("mouseout", () => this.handleMouseOut(column));
        // Try to play a move by clicking on a column
        column.addEventListener("click", () => this.handleClick(i));
      }
    }
  }

  /*  Display the board in document */

  toHTML() {
    let content = '<div class="board">';

    // The board is displayed column by column with low indexes of
    // rows on the bottom with the help of css flexbox see css class ".column"

    for (let i = 0; i < this.columns; i++) {
      let column = '<div class="column column' + i + '">';

      for (let j = 0; j < this.rows; j++) {
        column += '<div class="square">';
        switch (this.position[i][j]) {
          case "Y":
            column += '<div class="yellowSquare"></div>';
            break;
          case "R":
            column += '<div class="redSquare"></div>';
            break;
          default:
            column += '<div class="emptySquare"></div>';
            break;
        }
        column += "</div>";
      }

      column +=
        '<div class="square upperSquare"><div class="emptySquare"></div></div></div>';
      content += column;
    }
    return content;
  }

  /* HELPERS */

  /* Returns the index of the first empty row 
  Returns -1 if the column is full */

  getEmptySlotIndex(column) {
    return column.indexOf(" ");
  }
  /* GETTERS */

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
      // Display the higher indexes of rows first
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
          this.position[i][j] = "";
        } else if (rand < 0.66) {
          this.position[i][j] = "Y";
        } else {
          this.position[i][j] = "R";
        }
      }
    }
  }
}
