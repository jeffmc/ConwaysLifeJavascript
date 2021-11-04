// made by jeff

function GameOfLife() {
  this.setup = function () {
    // get canvas context
    this.canvas = document.getElementById("game");
    (this.canvasWidth = 600), (this.canvasHeight = 600); // TODO: Fix this.
    this.gfx = this.canvas.getContext("2d");
    (this.fieldWidth = 25), (this.fieldHeight = 25); // TODO: Fix canvas aspect ratio for square cells.

    this.infoParagraph = document.getElementById("info");
    this.infoParagraph.innerHTML = `<b>${this.fieldWidth}x${this.fieldHeight}</b> - ${new Date().toDateString()}`;

    //determine cell dimensions
    this.cellWidth = Math.floor(this.canvasWidth / this.fieldWidth); // use floor() because float math can leave gaps between
    this.cellHeight = Math.floor(this.canvasHeight / this.fieldHeight);

    this.textSize = Math.floor(this.cellHeight * 0.7);

    this.gfx.textBaseline = "middle";
    this.gfx.textAlign = "center";
    this.gfx.font = `bold ${this.textSize}px sans-serif`;

    this.gameOver = false;
    this.wonGame = false;

    // clear background
    this.gfx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.generateField(); // gen field

    this.game = this;
  };

  this.generateField = function () {
    // width, height, and number of mines
    this.field = [];
    let totalSize = this.fieldWidth * this.fieldHeight;
    let x, y; // x and y coordinates for the below for loop.
    for (let i = 0; i < totalSize; i++) {
      this.field[i] = false;
      x = i % this.fieldWidth;
      y = Math.floor(i / this.fieldWidth);
      this.gfx.fillStyle = (x + (y % 2)) % 2 == 0 ? "#555555" : "#666666";
      this.gfx.fillRect(
        x * this.cellWidth,
        y * this.cellHeight,
        this.cellWidth,
        this.cellHeight
      );
    }
  };

  this.stepCell = function (x,y) {
    let idx = this.getFieldIDX(x,y);
    let xp = x < this.fieldWidth - 1,
      xn = x > 0; // x +/- available
    let yp = y < this.fieldHeight - 1,
      yn = y > 0; // y +/- available
    let neighbors = 0;
    if (xp && yp) this.field[this.getFieldIDX(x + 1, y + 1)]++;
    if (xn && yp) this.field[this.getFieldIDX(x - 1, y + 1)]++;
    if (xp && yn) this.field[this.getFieldIDX(x + 1, y - 1)]++;
    if (xn && yn) this.field[this.getFieldIDX(x - 1, y - 1)]++;
    if (xp) this.field[this.getFieldIDX(x + 1, y)]++;
    if (xn) this.field[this.getFieldIDX(x - 1, y)]++;
    if (yp) this.field[this.getFieldIDX(x, y + 1)]++;
    if (yn) this.field[this.getFieldIDX(x, y - 1)]++;
  };

  this.toggleCell = function (x, y) {
    let idx = this.getFieldIDX(x, y);
    field[idx] = !field[idx];
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

  this.drawCell = function (x, y, status) {
    this.gfx.fillStyle = (x + (y % 2)) % 2 == 0 ? "#555555" : "#666666";
    this.gfx.fillRect(
      x * this.cellWidth,
      y * this.cellHeight,
      this.cellWidth,
      this.cellHeight
    );
    if (status) {
      this.gfx.fillStyle = "#00CC00";
      this.gfx.fillRect(
        x * this.cellWidth + this.flagGap,
        y * this.cellHeight + this.flagGap,
        this.cellWidth - this.flagGap * 2,
        this.cellHeight - this.flagGap * 2
      );
    }
  };
  this.step = function () {
    let nextField = [];
  }
}
let container = {};
container.gameOfLife = new GameOfLife();
function start() {
  container.gameOfLife.setup();
  // setInterval(tickit.bind(container), 50);
}
function tickit() {
  this.gameOfLife.step();
}
window.addEventListener("load", start);
