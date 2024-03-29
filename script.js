// made by jeff

function GameOfLife() {
  this.setup = function () {
    // get canvas context
    this.canvas = document.getElementById("game");
    (this.canvasWidth = 600), (this.canvasHeight = 600); // TODO: Fix this.
    this.gfx = this.canvas.getContext("2d");
    (this.fieldWidth = 100), (this.fieldHeight = 100); // TODO: Fix canvas aspect ratio for square cells.

    this.infoParagraph = document.getElementById("info");
    this.infoParagraph.innerHTML = `<b>${this.fieldWidth}x${
      this.fieldHeight
    }</b> - ${new Date().toDateString()}`;

    //determine cell dimensions
    this.cellWidth = Math.floor(this.canvasWidth / this.fieldWidth); // use floor() because float math can leave gaps between
    this.cellHeight = Math.floor(this.canvasHeight / this.fieldHeight);

    // this.textSize = Math.floor(this.cellHeight * 0.7);
    // this.gfx.textBaseline = "middle";
    // this.gfx.textAlign = "center";
    // this.gfx.font = `bold ${this.textSize}px sans-serif`;

    this.drawGridLines = false;

    // clear background
    this.gfx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.field = this.generateField(); // generate blank field
    this.drawField();
  };

  this.generateField = function () { // TODO: Make multiple different field generators, give user with prompt to pick from.
    // width, height, and number of mines
    let newField = [];
    let totalSize = this.fieldWidth * this.fieldHeight;
    let x, y; // x and y coordinates for the below for loop.
    for (let i = 0; i < totalSize; i++) {
      newField[i] = Math.random() < 0.1;
    }
    return newField;
  };

  this.getFieldIDX = function (x, y) {
    return y * this.fieldWidth + x;
  };

  this.getFieldX = function (idx) {
    return idx % this.fieldWidth;
  };

  this.getFieldY = function (idx) {
    return Math.floor(idx / this.fieldWidth);
  };

  this.stepCell = function (x, y, cf, nf) {
    // If alive
    //   0 or 1 neighbors - dies of loneliness
    //   2 or 3 neighbors - survives to next round
    //   4 or more neighbors - dies of overcrowding
    // If dead
    //   3 neighbors - becomes populated

    // cf is currentField, nf is nextField
    let idx = this.getFieldIDX(x, y);
    let xp = x < this.fieldWidth - 1,
      xn = x > 0; // x +/- available
    let yp = y < this.fieldHeight - 1,
      yn = y > 0; // y +/- available
    let neighbors = 0;
    if (xp && yp)
      neighbors += this.field[this.getFieldIDX(x + 1, y + 1)] ? 1 : 0;
    if (xn && yp)
      neighbors += this.field[this.getFieldIDX(x - 1, y + 1)] ? 1 : 0;
    if (xp && yn)
      neighbors += this.field[this.getFieldIDX(x + 1, y - 1)] ? 1 : 0;
    if (xn && yn)
      neighbors += this.field[this.getFieldIDX(x - 1, y - 1)] ? 1 : 0;
    if (xp) neighbors += this.field[this.getFieldIDX(x + 1, y)] ? 1 : 0;
    if (xn) neighbors += this.field[this.getFieldIDX(x - 1, y)] ? 1 : 0;
    if (yp) neighbors += this.field[this.getFieldIDX(x, y + 1)] ? 1 : 0;
    if (yn) neighbors += this.field[this.getFieldIDX(x, y - 1)] ? 1 : 0;
    let nextState = false;
    if (cf[idx]) {
      if (neighbors >= 2 && neighbors <= 3) {
        nextState = true;
      }
    } else {
      if (neighbors == 3) nextState = true;
    }
    nf[idx] = nextState;
  };

  this.stepField = function () {
    let nextField = [];
    for (let y = 0; y < this.fieldHeight; y++) {
      for (let x = 0; x < this.fieldWidth; x++) {
        this.stepCell(x, y, this.field, nextField);
      }
    }
    this.field = nextField;
  };

  this.drawCell = function (x, y, state) {
    this.gfx.fillStyle = state ? "#0000aa" : "#000000";
    this.gfx.fillRect(
      x * this.cellWidth,
      y * this.cellHeight,
      this.cellWidth,
      this.cellHeight
    );
  };

  this.drawField = function () {
    for (let y = 0; y < this.fieldHeight; y++) {
      for (let x = 0; x < this.fieldWidth; x++) {
        this.drawCell(x, y, this.field[y * this.fieldWidth + x]);
      }
    }
    if (this.drawGridLines) {
      this.gfx.lineWidth = 0.5;
      this.gfx.strokeStyle = "#ffffff";
      this.gfx.setTransform(1, 0, 0, 1, 0.5, 0.5); // https://stackoverflow.com/questions/7530593/html5-canvas-and-line-width/7531540#7531540 To get pixel-perfect lines.
      this.gfx.beginPath();
      for (let i = 1; i < this.fieldWidth; i++) {
        this.gfx.moveTo(i * this.cellWidth, 0);
        this.gfx.lineTo(i * this.cellWidth, this.canvasHeight);
        this.gfx.moveTo(0, i * this.cellWidth);
        this.gfx.lineTo(this.canvasWidth, i * this.cellWidth);
      }
      this.gfx.closePath();
      this.gfx.stroke();
    }
    this.gfx.setTransform(1, 0, 0, 1, 0, 0);
  };
  this.update = function () {
    this.stepField();

    this.gfx.fillStyle = "#000000";
    this.gfx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.drawField();
  };
  this.userToggleCell = function (x, y) {
    // Should only be called in response to user input.
    let idx = this.getFieldIDX(x, y);
    this.field[idx] = !this.field[idx];
  };
  this.clicked = function (e) {
    let cellX = Math.floor(e.offsetX / this.cellWidth);
    let cellY = Math.floor(e.offsetY / this.cellHeight);
    this.userToggleCell(cellX, cellY);
    this.drawField();
  };
}

let container = {};
container.gameOfLife = new GameOfLife();
function tickit() {
  this.gameOfLife.update();
}
function canvasClick(e) {
  this.gameOfLife.clicked(e);
}
tickit = tickit.bind(container);
canvasClick = canvasClick.bind(container);
function start() {
  container.gameOfLife.setup(); // TODO: Add clear, regenerate, and new any other tools to manually manipulate field.
  setInterval(tickit, 50); // TODO: Better control loop, add pause/play
}
window.addEventListener("load", start);
document.querySelector("#step").addEventListener("click", tickit);
document.querySelector("#game").addEventListener("click", canvasClick);
