import { CANVAS, GRID } from "./consts.js";

export default class Snake {
  constructor(x, y) {
    this.x = x || 160;
    this.y = y || 160;
    this.startX = x || 160;
    this.startY = y || 160;
    this.dx = GRID;
    this.dy = 0;
    this.cells = [];
    this.maxCells = 4;
  }

  step() {
    this.x += this.dx;
    this.y += this.dy;
  }

  checkWall() {
    if (this.x < 0) {
      this.x = CANVAS.width - GRID;
    } else if (this.x >= CANVAS.width) {
      this.x = 0;
    }

    if (this.y < 0) {
      this.y = CANVAS.height - GRID;
    } else if (this.y >= CANVAS.height) {
      this.y = 0;
    }
  }
  getData() {
    return {
      x: this.x,
      y: this.y,
      dx: this.dx,
      dy: this.dy,
      cells: this.cells,
      maxCells: this.maxCells,
    };
  }

  moving() {
    this.cells.unshift({ x: this.x, y: this.y });

    if (this.cells.length > this.maxCells) {
      this.cells.pop();
    }
  }

  increase() {
    this.maxCells++;
  }

  movement(dx, dy) {
    this.dx = dx;
    this.dy = dy;
  }

  gameOver(x, y) {
    const bones = this.cells
      .map((i, ind) => {
        if ((ind + 1) % 3 === 0) {
          return i;
        }
      })
      .filter((it) => it !== undefined);
    this.x = x || this.startX;
    this.y = y || this.startY;
    this.cells = [];
    this.maxCells = 4;
    this.dx = GRID;
    this.dy = 0;
    return bones;
  }

  checkGameOver(i, x, y) {
    if (x === this.cells[i].x && y === this.cells[i].y) {
      this.gameOver();
      return true;
    }
  }
}
