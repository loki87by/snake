export const SCORE = document.getElementById("score");
export const SCORE2 = document.getElementById("score2");
export const CANVAS = document.getElementById("game");
export const CONTEXT = CANVAS.getContext("2d");
export const OPTIONS = document.getElementById("options");
export const SPEED = document.getElementById("speed");
export const THROUGH = document.getElementById("through");
export const PLAYERS = document.getElementsByName("players");
export const PLAYERS_INFO = document.getElementById("playersInfo");
export const START = document.getElementById("start");
export const HINT = document.getElementById("hint");
export const GRID = 16;
export const PREY = {
  x: 400,
  y: 400,
};

const GET_RANDOM_INT = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

export function CHANGE_THROUGH(val) {
  if (val) {
    CANVAS.classList.remove("through");
  } else {
    CANVAS.classList.add("through");
  }
}

export function CHANGE_PLAYERS(value) {
  if (value) {
    SCORE.textContent = "Счёт (игрок 1): 0";
    SCORE2.classList.remove("hidden");
    HINT.children[2].classList.remove("hidden");
  } else {
    SCORE.textContent = "Счёт: 0";
    SCORE2.classList.add("hidden");
    HINT.children[2].classList.add("hidden");
  }
}

export function NEW_PREY() {
  PREY.x = GET_RANDOM_INT(0, 45) * GRID;
  PREY.y = GET_RANDOM_INT(0, 35) * GRID;
}
