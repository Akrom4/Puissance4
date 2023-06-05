// Game display
class Board {
  audio;
  moveSound;
  level;
  game;
  turn;
  engine;

  constructor(rows, columns, audio = true, level = null, humanColor = null) {
    this.game = new Game(rows, columns); // Create an instance of the Game class
    this.audio = audio;
    this.level = level;
    if (this.audio) {
      this.loadSound();
    }
    if (level) {
      this.engine = new Engine(this.game, this.level);
    }
    if (humanColor) {
      this.humanColor = humanColor;
    }
    if (humanColor = "R") {
      this.engineMove();
    }
  }

  /* Make the engine play a move  */
  engineMove() {
    // Check if it's the engine's turn
    if (this.level && this.game.getTurn() !== this.humanColor) {
      let engineMoveColumn = this.engine.makeDecision();
      this.playMove(engineMoveColumn);
    }
  }

  /* Handle audio */
  loadSound() {
    this.moveSound = new Audio("audio/move-sound.mp3");
    this.moveSound.onerror = function () {
      console.log("Error loading audio file");
    };
  }

  /* Try to play a move */

  playMove(colNum) {
    this.turn = this.game.getTurn();
    const lastTurn = this.game.playMove(colNum); // Saves the move player color
    if (lastTurn) {
      const winningSequence = this.game.checkWinCondition(lastTurn);
      if (winningSequence) {
        console.log("Player " + lastTurn + " wins!");

        // Stop the game by redrawing the board without the event listeners
        document.getElementById("gameBoard").innerHTML = this.toHTML(winningSequence);
      } else {
        this.turn = this.game.getTurn();
        if (this.audio && this.moveSound) {
          this.moveSound.play().catch(function (error) {
            console.log("Error playing audio file");
          });
        }
        // Draw the board with new position
        document.getElementById("gameBoard").innerHTML = this.toHTML();
        this.addMouseOverEvents();

        // Engine move
        this.engineMove();
      }
    }
  }

  /* Add mouse events to the board */
  handleMouseOver(column) {
    const currentPlayer = this.game.getTurn();
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
    const position = this.game.getPosition();
    const columns = document.getElementById("gameBoard").getElementsByClassName("column");

    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      // Add events only if the column isn't full
      if (this.game.getEmptySlotIndex(position[i]) !== -1) {
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

  toHTML(winningSequence = null) {
    let content = '<div class="board">';

    // The board is displayed column by column with low indexes of
    // rows on the bottom using CSS flexbox see css class ".column"
    const position = this.game.getPosition();
    for (let i = 0; i < this.game.getColumns(); i++) {
      let column = '<div class="column column' + i + '">';

      for (let j = 0; j < this.game.getRows(); j++) {
        column += '<div class="square">';
        if (winningSequence && winningSequence.some(([x, y]) => x === i && y === j)) {
          // This square is part of the winning sequence, add the cross
          column += '<div class="cross"></div>';
        }
        switch (position[i][j]) {
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

  /* Display the user interface */

  userInterface() {
    let content = ` <div id="gameInfo">
                            <p>Objectif <span id="winCount">${this.game.getWinCondition()}</span> à la suite !</p>
                          </div>                      
                          <button id="undoButton">Undo Move</button>
                          <button id="resetButton">Reset Game</button>
                          <div id="soundControl">
                            <input type="checkbox" id="soundCheck" checked>
                            <label for="soundCheck">Sound On/Off</label>
                          </div>
                        `;
    return content;
  }

  /* Handle undo move button */

  undoMove() {
    if(this.level){
      this.game.undoMove();
      this.game.undoMove();
    }
    // Update the board
    document.getElementById("gameBoard").innerHTML = this.toHTML();
    this.addMouseOverEvents();
  }

  /* Audio on/off */
  toggleAudio() {
    this.audio = !this.audio;
    if (this.audio && !this.moveSound) {
      this.loadSound();
    }
  }
}
