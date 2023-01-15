export const CANVAS = document.getElementById("game");
export const CONTEXT = CANVAS.getContext("2d");
export const GRID = 16;
export const SNAKE = {
  x: 160,
  y: 160,
  dx: GRID,
  dy: 0,
  cells: [],
  maxCells: 4,
};
export const PREY = {
  x: 400,
  y: 400,
};

export const GET_RANDOM_INT = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};
