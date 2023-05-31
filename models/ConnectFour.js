// The game homepage where you can select options before starting the game

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
        // Clear 'app' div
        document.getElementById("app").innerHTML = '';
    
        if (mode === '1') {
            this.board = new Board(rows, columns, audio, level);
        } else {
            this.board = new Board(rows, columns, audio);
        }
    
        this.render();
        this.board.addMouseOverEvents();
    }
    /* Render the board in the DOM */
    render() {
        document.getElementById("app").innerHTML += this.board.toHTML();
    }   
}
