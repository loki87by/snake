import { CANVAS, CONTEXT, GRID, SNAKE, PREY, GET_RANDOM_INT } from "./consts.js";

const requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame;
const cancelAnimationFrame =
  window.cancelAnimationFrame || window.mozCancelAnimationFrame;
let count = 0;
let isPaused = false;
let frame = null;

function loop() {
  frame = requestAnimationFrame(loop);

  if (++count < 11) {
    return;
  }

  count = 0;
  CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height);
  SNAKE.x += SNAKE.dx;
  SNAKE.y += SNAKE.dy;

  if (SNAKE.x < 0) {
    SNAKE.x = CANVAS.width - GRID;
  } else if (SNAKE.x >= CANVAS.width) {
    SNAKE.x = 0;
  }

  if (SNAKE.y < 0) {
    SNAKE.y = CANVAS.height - GRID;
  } else if (SNAKE.y >= CANVAS.height) {
    SNAKE.y = 0;
  }
  SNAKE.cells.unshift({ x: SNAKE.x, y: SNAKE.y });
  if (SNAKE.cells.length > SNAKE.maxCells) {
    SNAKE.cells.pop();
  }
  CONTEXT.fillStyle = "red";
  CONTEXT.fillRect(PREY.x, PREY.y, GRID - 1, GRID - 1);
  CONTEXT.fillStyle = "green";
  SNAKE.cells.forEach(function (cell, index) {
    CONTEXT.fillRect(cell.x, cell.y, GRID - 1, GRID - 1);

    if (cell.x === PREY.x && cell.y === PREY.y) {
      SNAKE.maxCells++;
      PREY.x = GET_RANDOM_INT(0, 45) * GRID;
      PREY.y = GET_RANDOM_INT(0, 35) * GRID;
    }

    for (let i = index + 1; i < SNAKE.cells.length; i++) {
      if (cell.x === SNAKE.cells[i].x && cell.y === SNAKE.cells[i].y) {
        SNAKE.x = 160;
        SNAKE.y = 160;
        SNAKE.cells = [];
        SNAKE.maxCells = 4;
        SNAKE.dx = GRID;
        SNAKE.dy = 0;
        PREY.x = GET_RANDOM_INT(0, 45) * GRID;
        PREY.y = GET_RANDOM_INT(0, 35) * GRID;
      }
    }
  });
}

function paused() {
  if (isPaused) {
    frame = requestAnimationFrame(loop);
  } else {
    cancelAnimationFrame(frame);
  }
  isPaused = !isPaused;
}

function controls(e) {
  if (e.key === "ArrowLeft" && SNAKE.dx === 0) {
    SNAKE.dx = -GRID;
    SNAKE.dy = 0;
  } else if (e.key === "ArrowUp" && SNAKE.dy === 0) {
    SNAKE.dy = -GRID;
    SNAKE.dx = 0;
  } else if (e.key === "ArrowRight" && SNAKE.dx === 0) {
    SNAKE.dx = GRID;
    SNAKE.dy = 0;
  } else if (e.key === "ArrowDown" && SNAKE.dy === 0) {
    SNAKE.dy = GRID;
    SNAKE.dx = 0;
  } else if (e.key === " ") {
    paused();
  }
}

document.addEventListener("keydown", controls);
frame = requestAnimationFrame(loop);
