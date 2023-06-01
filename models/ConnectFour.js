// The game homepage where you can select options and initialization of the game

class ConnectFour {
    constructor() {
        this.createAppDiv();
        this.createBoardSizeForm();
    }

    /* Create a container for the application named 'app' */
    createAppDiv() {
        const appDiv = document.createElement('div');
        appDiv.setAttribute('id', 'app');
        document.body.appendChild(appDiv);
    }

    /* Create the form which contains the options for the game */
    createBoardSizeForm() {
        const formHTML = `
        <form id="boardSize">
            <label for="row">Rangées</label>
            <input type="number" id="row" min="4" max="20" value="6">
            <label for="column">Colonnes</label>
            <input type="number" id="column" min="4" max="20" value="7">
            <label for="audio">Audio</label>
            <input type="checkbox" id="audio" checked>
            <label for="mode">Mode</label>
            <select id="mode">
                <option value="2">2 Joueurs</option>
                <option value="1">1 Joueur (vs IA)</option>
            </select>
            <div id="levelContainer" style="display: none;">
                <label for="level">Niveau</label>
                <select id="level">
                    <option value="0">Nul !</option>
                    <option value="1">Facile</option>
                    <option value="2">Moyen</option>
                    <option value="3">Dur</option>
                    <option value="4">Extrême !</option>
                </select>
            </div>
            <button type="button" id="playButton">Jouer !</button>
        </form>`;

        document.getElementById("app").innerHTML = formHTML;

        const modeSelect = document.getElementById('mode');
        const levelContainer = document.getElementById('levelContainer');

        modeSelect.addEventListener('change', () => {
            if (modeSelect.value === '1') {
                levelContainer.style.display = 'block';
            } else {
                levelContainer.style.display = 'none';
            }
        });

        document.getElementById('playButton').addEventListener('click', () => {
            const rows = document.getElementById('row').value;
            const columns = document.getElementById('column').value;
            const audio = document.getElementById('audio').checked;
            const mode = document.getElementById('mode').value;
            const level = document.getElementById('level').value;
            this.start(rows, columns, audio, mode, level);
        });
    }

    /* Initialize and launch the game */
    start(rows, columns, audio, mode, level) {
        let squareSize = Math.min(window.innerWidth / columns, window.innerHeight / rows) * 0.7;
        document.documentElement.style.setProperty("--square-size", `${squareSize}px`);
        // Prepare 'app' div
        document.getElementById("app").innerHTML = `<div id="gameControls"></div>
                                                    <div id="gameBoard"></div>
                                                    `;

        if (mode === '1') {
            this.board = new Board(rows, columns, audio, level);
        } else {
            this.board = new Board(rows, columns, audio);
        }

        this.render();
        this.board.addMouseOverEvents();
    }

    /* Render the game in the DOM */

    render() {
        // Get the divs for user interface and game board
        const userInterfaceDiv = document.getElementById("gameControls");
        const boardDiv = document.getElementById("gameBoard");

        // Update the divs with the UI and board
        userInterfaceDiv.innerHTML = this.board.userInterface();
        boardDiv.innerHTML = this.board.toHTML();
        // Add reset button functionality
        const resetButton = document.getElementById("resetButton");
        resetButton.addEventListener("click", () => {
            // Reinitialize the game board with the same parameters
            this.start(this.board.game.getRows(), this.board.game.getColumns(), this.board.audio, this.board.mode, this.board.level);
        });

        // Add undo button functionality
        const undoButton = document.getElementById("undoButton");
        undoButton.addEventListener("click", () => {
            // Undo the last move
            this.board.undoMove();
        });

        // Add sound toggle functionality
        const soundCheckbox = document.getElementById("soundCheck");
        // Set checkbox initial state to match game audio setting
        soundCheckbox.checked = this.board.audio;
        soundCheckbox.addEventListener("change", () => {
            // Toggle the audio on/off
            this.board.toggleAudio();
        });
    }
}
