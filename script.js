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
  SNAKE,
  PREY,
  GET_RANDOM_INT,
  RESTART,
} from "./consts.js";

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

function changeThrough(e) {
  const value = Boolean(e.target.value);
  if (value) {
    CANVAS.classList.remove("through");
  } else {
    CANVAS.classList.add("through");
  }
  through = value;
}

function loop() {
  frame = requestAnimationFrame(loop);

  if (++count < 6 - currentSpeed) {
    return;
  }

  count = 0;
  CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height);
  SNAKE.x += SNAKE.dx;
  SNAKE.y += SNAKE.dy;

  if (through) {
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
  } else {
    if (
      SNAKE.x < 0 ||
      SNAKE.x >= CANVAS.width ||
      SNAKE.y >= CANVAS.height ||
      SNAKE.y < 0
    ) {
      RESTART();
      score = 0;
    }
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
      score++;
      SCORE.textContent = "Счёт: " + score;
      PREY.x = GET_RANDOM_INT(0, 45) * GRID;
      PREY.y = GET_RANDOM_INT(0, 35) * GRID;
    }

    for (let i = index + 1; i < SNAKE.cells.length; i++) {
      if (cell.x === SNAKE.cells[i].x && cell.y === SNAKE.cells[i].y) {
        RESTART();
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

function start() {
  OPTIONS.classList.add("hidden");
  frame = requestAnimationFrame(loop);
  HINT.classList.remove("hidden");
}

document.addEventListener("keydown", controls);
SPEED.addEventListener("change", (e) => {
  console.log(frame)
  currentSpeed = e.target.value;
});
THROUGH.addEventListener("change", changeThrough);
START.addEventListener("click", start);
