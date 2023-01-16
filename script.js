import {
  SCORE,
  CANVAS,
  CONTEXT,
  OPTIONS,
  SPEED,
  THROUGH,
  START,
  HINT,
  GRID,
  PREY,
  GET_RANDOM_INT,
} from "./consts.js";

import Snake from "./Snake.js";

const requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame;
const cancelAnimationFrame =
  window.cancelAnimationFrame || window.mozCancelAnimationFrame;
let count = 0;
let score = 0;
let timestamp = 0;
let currentSpeed = 1;
let through = true;
let isPaused = false;
let frame = null;
const snake = new Snake();

function changeThrough(e) {
  const value = Boolean(e.target.value);
  if (value) {
    CANVAS.classList.remove("through");
  } else {
    CANVAS.classList.add("through");
  }
  through = value;
}

function newPrey() {
  PREY.x = GET_RANDOM_INT(0, 45) * GRID;
  PREY.y = GET_RANDOM_INT(0, 35) * GRID;
}

function loop() {
  frame = requestAnimationFrame(loop);

  if (++count < 6 - currentSpeed) {
    return;
  }

  count = 0;
  CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height);
  snake.step();
  if (through) {
    snake.checkWall();
  } else {
    const data = snake.getData();
    if (
      data.x < 0 ||
      data.x >= CANVAS.width ||
      data.y >= CANVAS.height ||
      data.y < 0
    ) {
      newPrey();
      score = 0;
    }
  }

  snake.moving();
  CONTEXT.fillStyle = "red";
  CONTEXT.fillRect(PREY.x, PREY.y, GRID - 1, GRID - 1);
  CONTEXT.fillStyle = "green";
  snake.getData().cells.forEach(function (cell, index) {
    CONTEXT.fillRect(cell.x, cell.y, GRID - 1, GRID - 1);

    if (cell.x === PREY.x && cell.y === PREY.y) {
      score++;
      SCORE.textContent = "Счёт: " + score;
      PREY.x = GET_RANDOM_INT(0, 45) * GRID;
      PREY.y = GET_RANDOM_INT(0, 35) * GRID;
      snake.increase();
    }

    for (let i = index + 1; i < snake.getData().cells.length; i++) {
      if (snake.checkGameOver(i, cell.x, cell.y)) {
        newPrey();
        score = 0;
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
  if (e.timeStamp <= timestamp + 10) {
    return;
  }
  timestamp = e.timeStamp;

  if (e.key === "ArrowLeft" && snake.getData().dx === 0) {
    snake.movement(-GRID, 0);
  } else if (e.key === "ArrowUp" && snake.getData().dy === 0) {
    snake.movement(0, -GRID);
  } else if (e.key === "ArrowRight" && snake.getData().dx === 0) {
    snake.movement(GRID, 0);
  } else if (e.key === "ArrowDown" && snake.getData().dy === 0) {
    snake.movement(0, GRID);
  } else if (e.key === " ") {
    paused();
  }
}

function start() {
  OPTIONS.classList.add("hidden");
  frame = requestAnimationFrame(loop);
  HINT.classList.remove("hidden");
}

document.addEventListener("keydown", controls);
SPEED.addEventListener("change", (e) => {
  currentSpeed = e.target.value;
});
THROUGH.addEventListener("change", changeThrough);
START.addEventListener("click", start);
