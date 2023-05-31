function start(rows, columns) {
  let squareSize =
    Math.min(window.innerWidth / columns, window.innerHeight / rows) * 0.7;
  document.documentElement.style.setProperty(
    "--square-size",
    `${squareSize}px`
  );
  let board = new Board(rows, columns);
  document.getElementById("app").innerHTML = board.toHTML();
  board.addMouseOverEvents();
}