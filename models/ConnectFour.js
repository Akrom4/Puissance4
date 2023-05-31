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

    /* Create the form which contains the options for the game   
           <label for="audio">Audio</label>
            <input type="checkbox" id="audio" checked>
    */
    createBoardSizeForm() {
        const formHTML = `
        <form id="boardSize">
            <label for="row">Rangées</label>
            <input type="number" id="row" min="4" max="20" value="6">
            <label for="column">Colonnes</label>
            <input type="number" id="column" min="4" max="20" value="7">
            <label for="audio">Audio</label>
            <input type="checkbox" id="audio" checked>
            <button type="button" id="playButton">Jouer !</button>
        </form>`;
    
        document.getElementById("app").innerHTML = formHTML;
    
        document.getElementById('playButton').addEventListener('click', () => {
            const rows = document.getElementById('row').value;
            const columns = document.getElementById('column').value;
            const audio = document.getElementById('audio').checked;
            this.start(rows, columns, audio);
        });
    }
    
    /* Launch the game */
    start(rows, columns, audio) {
        let squareSize = Math.min(window.innerWidth / columns, window.innerHeight / rows) * 0.7;
        document.documentElement.style.setProperty("--square-size", `${squareSize}px`);
        // Clear 'app' div
        document.getElementById("app").innerHTML = '';
        this.board = new Board(rows, columns, audio);
        this.render();
        this.board.addMouseOverEvents();
    }

    render() {
        document.getElementById("app").innerHTML += this.board.toHTML();
    }   
}
