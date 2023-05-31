class Board {
  rows;
  columns;
  position;
  turn; // Y for Yellow player || R for Red player

  constructor(rows, columns, turn = "Y") {
    this.rows = rows;
    this.columns = columns;
    this.position = [];

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

  /* Try to play a move */

  playMove(colNum) {
    // Get the selected column
    const column = this.position[colNum];

    // Find the first empty slot in the column
    const emptySlotIndex = this.getEmptySlotIndex(column);
    if (emptySlotIndex !== -1) {
      // Place the token of the current player
      column[emptySlotIndex] = this.turn;

      // Switch the turn to the other player
      this.turn = this.turn === "Y" ? "R" : "Y";

      // Redraw the board
      document.getElementById("app").innerHTML = this.toHTML();
      this.addMouseOverEvents();
    }
  }

  /* Returns the index of the first empty row 
  Returns -1 if the column is full */

  getEmptySlotIndex(column) {
    return column.indexOf(" ");
  }

  /* Add mouse events to the board */

  addMouseOverEvents() {
    const columns = document.getElementsByClassName("column");

    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (this.getEmptySlotIndex(this.position[i]) !== -1) { // Add events only if the column isn't full
        column.addEventListener("mouseover", () => {         // Make the token appear when hovering a column
          const currentPlayer = this.getTurn();
          const upperSquare = column.getElementsByClassName("upperSquare")[0];
          if (currentPlayer === "Y") {
            upperSquare.innerHTML = '<div class="yellowSquare"></div>';
          } else if (currentPlayer === "R") {
            upperSquare.innerHTML = '<div class="redSquare"></div>';
          }
        });

        
        column.addEventListener("mouseout", () => {           // Reset the upper square when the mouse leaves the column
          const upperSquare = column.getElementsByClassName("upperSquare")[0];
          upperSquare.innerHTML = '<div class="emptySquare"></div>';
        });

        column.addEventListener("click", () => {              // Try to play a move on clicking a column
          this.playMove(i);
        });
      }
   }
  }

  /* Display the board in console */

  toLog() {
    console.log("Current Board Position log :");
    for (let j = this.rows - 1; j >= 0; j--) {    // Display the higher indexes of rows first  
      let row = "";
      for (let i = 0; i < this.columns; i++) {
        row += this.position[i][j] || " ";
        row += "\t";
      }
      console.log(row);
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

  /* Getters */

  getPosition(){
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
}
