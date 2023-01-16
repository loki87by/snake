export const SCORE = document.getElementById("score");
export const SCORE2 = document.getElementById("score2");
export const CANVAS = document.getElementById("game");
export const CONTEXT = CANVAS.getContext("2d");
export const OPTIONS = document.getElementById("options");
export const SPEED = document.getElementById("speed");
export const THROUGH = document.getElementById("through");
export const PLAYERS = document.getElementById("players");
export const START = document.getElementById("start");
export const HINT = document.getElementById("hint");
export const GRID = 16;
export const PREY = {
  x: 400,
  y: 400,
};
export const GET_RANDOM_INT = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};
