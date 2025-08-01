const CELL_SIZE = 40;
const COLOR_R = 123;
const COLOR_G = 175;
const COLOR_B = 212;
const AMT_FADE_PER_FRAME = 5;

let numRows, numCols;
let currentRow = -2, currentCol = -2;
let allNeighbors = [];

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent(document.body);
  cnv.id('gridCanvas');
  cnv.style('z-index', '-1');
  clear();
  noFill();
  strokeWeight(1);
  numRows = ceil(windowHeight / CELL_SIZE);
  numCols = ceil(windowWidth / CELL_SIZE);
}

function draw() {
  clear();
  let row = floor(mouseY / CELL_SIZE);
  let col = floor(mouseX / CELL_SIZE);
  
  if (row !== currentRow || col !== currentCol) {
    currentRow = row;
    currentCol = col;
    allNeighbors.push(...getRandomNeighbors(row, col));
  }
  
  for (let neighbor of allNeighbors) {
    let x = neighbor.col * CELL_SIZE;
    let y = neighbor.row * CELL_SIZE;
    neighbor.opacity = max(0, neighbor.opacity - AMT_FADE_PER_FRAME);
    stroke(COLOR_R, COLOR_G, COLOR_B, neighbor.opacity);
    rect(x, y, CELL_SIZE, CELL_SIZE);
  }
  
  allNeighbors = allNeighbors.filter(n => n.opacity > 0);
}

function getRandomNeighbors(row, col) {
  let neighbors = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      let nr = row + dr, nc = col + dc;
      if ((dr !== 0 || dc !== 0) && nr >= 0 && nc >= 0 && nr < numRows && nc < numCols && Math.random() < 0.5) {
        neighbors.push({ row: nr, col: nc, opacity: 255 });
      }
    }
  }
  return neighbors;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  numRows = ceil(windowHeight / CELL_SIZE);
  numCols = ceil(windowWidth / CELL_SIZE);
}

window.setup = setup;
window.draw = draw;
