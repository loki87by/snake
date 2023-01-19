import {
  SCORE,
  SCORE2,
  CANVAS,
  CONTEXT,
  OPTIONS,
  SPEED,
  THROUGH,
  PLAYERS,
  PLAYERS_INFO,
  START,
  HINT,
  GRID,
  PREY,
  CHANGE_THROUGH,
  CHANGE_PLAYERS,
  NEW_PREY,
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
let score2 = 0;
let timestamp = 0;
let timestamp2 = 0;
let currentSpeed = 1;
let through = true;
let isPaused = false;
let multiple = false;
let isSomeDead = false;
let frame = null;
let secondPlayer = null;
let timer = null;
let bones = [];
const snake = new Snake();

function changeThrough(e) {
  const value = e.target.checked;
  CHANGE_THROUGH(value);
  through = value;
}

function changePlayers(e) {
  const value = Boolean(e.target.value);
  multiple = value;

  if (value) {
    secondPlayer = new Snake(560, 400);
    PLAYERS_INFO.removeAttribute("style");
  } else {
    secondPlayer = null;
    PLAYERS_INFO.setAttribute("style", "opacity: 0");
  }
  CHANGE_PLAYERS(value);
}

function loop() {
  frame = requestAnimationFrame(loop);

  if (++count < 6 - currentSpeed) {
    return;
  }

  count = 0;
  CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height);
  snake.step();

  if (multiple) {
    secondPlayer.step();
  }

  if (through) {
    snake.checkWall();

    if (multiple) {
      secondPlayer.checkWall();
    }
  } else {
    const data = snake.getData();

    if (
      data.x < 0 ||
      data.x >= CANVAS.width ||
      data.y >= CANVAS.height ||
      data.y < 0
    ) {
      NEW_PREY();
      score = 0;
    }

    if (multiple) {
      const data = secondPlayer.getData();

      if (
        data.x < 0 ||
        data.x >= CANVAS.width ||
        data.y >= CANVAS.height ||
        data.y < 0
      ) {
        NEW_PREY();
        score2 = 0;
      }
    }
  }

  function step(obj, scoreSelector, ind, secondSnake) {
    obj.getData().cells.forEach(function (cell, index) {
      CONTEXT.fillRect(cell.x, cell.y, GRID - 1, GRID - 1);

      function feeding(x, y, isPrey) {
        if (cell.x === x && cell.y === y) {
          if (ind === 1) {
            score++;
            scoreSelector.textContent = `Счёт: ${score}`;

            if (multiple) {
              scoreSelector.textContent = `Счёт (игрок 1): ${score}`;
            }
          }

          if (ind === 2) {
            score2++;
            scoreSelector.textContent = `Счёт (игрок 2): ${score2}`;
          }

          if (isPrey) {
            NEW_PREY();
          } else {
            if (!isSomeDead) {
              const eatedBone = bones.findIndex(
                (i) => i.x === cell.x && i.y === cell.y
              );
              bones = [
                ...bones.slice(0, eatedBone),
                ...bones.slice(eatedBone + 1),
              ];
            }
          }
          obj.increase();
        }
      }

      function resurrection() {
        isSomeDead = false;
        clearTimeout(timer);
        timer = null;
      }

      feeding(PREY.x, PREY.y, true);

      if (bones.length > 0) {
        bones.forEach((i) => {
          feeding(i.x, i.y);
        });
      }

      for (let i = index + 1; i < obj.getData().cells.length; i++) {
        if (obj.checkGameOver(i, cell.x, cell.y)) {
          NEW_PREY();

          if (ind === 1) {
            score = 0;
          }

          if (ind === 2) {
            score2 = 0;
          }

          if (multiple) {
            scoreSelector.textContent = `Счёт (игрок ${ind}): 0`;
          } else {
            SCORE.textContent = "Счёт: 0";
          }
        }
      }

      if (secondSnake) {
        secondSnake.getData().cells.forEach(function (cell2) {
          if (
            obj.getData().cells[0] !== undefined &&
            obj.getData().cells[0].x === cell2.x &&
            obj.getData().cells[0].y === cell2.y
          ) {
            const preBones = obj.gameOver(720 - cell2.x, 560 - cell2.y);
            isSomeDead = true;
            timer = setTimeout(resurrection, 500);
            const preBones2 = preBones
              .map((bone) => {
                if (
                  !obj
                    .getData()
                    .cells.some((i) => i.x === bone.x && i.y === bone.y)
                ) {
                  return bone;
                }
              })
              .filter((i) => i !== undefined);
            bones = preBones2
              .map((bone) => {
                if (
                  !secondSnake
                    .getData()
                    .cells.some((i) => i.x === bone.x && i.y === bone.y)
                ) {
                  return bone;
                }
              })
              .filter((i) => i !== undefined);

            if (ind === 1) {
              score = 0;
            }

            if (ind === 2) {
              score2 = 0;
            }
            scoreSelector.textContent = `Счёт (игрок ${ind}): 0`;
          }
        });
      }
    });
  }

  snake.moving();

  if (multiple) {
    secondPlayer.moving();
  }
  CONTEXT.fillStyle = "red";
  CONTEXT.fillRect(PREY.x, PREY.y, GRID - 1, GRID - 1);
  CONTEXT.fillStyle = "green";

  if (!multiple) {
    step(snake, SCORE, 1);
  } else {
    step(snake, SCORE, 1, secondPlayer);
    CONTEXT.fillStyle = "yellow";
    step(secondPlayer, SCORE2, 2, snake);

    if (bones.length > 0) {
      CONTEXT.fillStyle = "red";
      bones.forEach((i) => {
        CONTEXT.fillRect(i.x, i.y, GRID - 1, GRID - 1);
      });
    }
  }
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
  if (e.key === " ") {
    paused();
  }

  if (e.timeStamp > timestamp + 50) {
    timestamp = e.timeStamp;

    if (e.key === "ArrowLeft" && snake.getData().dx === 0) {
      snake.movement(-GRID, 0);
    } else if (e.key === "ArrowUp" && snake.getData().dy === 0) {
      snake.movement(0, -GRID);
    } else if (e.key === "ArrowRight" && snake.getData().dx === 0) {
      snake.movement(GRID, 0);
    } else if (e.key === "ArrowDown" && snake.getData().dy === 0) {
      snake.movement(0, GRID);
    }
  }

  if (multiple && e.timeStamp > timestamp2 + 50) {
    timestamp2 = e.timeStamp;

    if (e.code === "KeyA" && secondPlayer.getData().dx === 0) {
      secondPlayer.movement(-GRID, 0);
    } else if (e.code === "KeyW" && secondPlayer.getData().dy === 0) {
      secondPlayer.movement(0, -GRID);
    } else if (e.code === "KeyD" && secondPlayer.getData().dx === 0) {
      secondPlayer.movement(GRID, 0);
    } else if (e.code === "KeyS" && secondPlayer.getData().dy === 0) {
      secondPlayer.movement(0, GRID);
    }
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
PLAYERS.forEach((i) => i.addEventListener("change", changePlayers));
START.addEventListener("click", start);
window.addEventListener("beforeunload", () => {
  cancelAnimationFrame(frame);
});
