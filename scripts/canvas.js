// File: grid-canvas.js

const CELL_SIZE = 40;
const COLOR_R = 123;
const COLOR_G = 175;
const COLOR_B = 212;
const FADE_SPEED = 5;
const NEIGHBOR_ADD_INTERVAL = 4; // only add neighbors every 4 frames

let numRows, numCols;
let currentRow = -2, currentCol = -2;
let allNeighbors = [];
let frameCounter = 0;

function setup() {
  const cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent(document.body);
  cnv.id('gridCanvas');
  cnv.style('position', 'fixed');
  cnv.style('top', '0');
  cnv.style('left', '0');
  cnv.style('z-index', '-1');
  cnv.style('pointer-events', 'none');
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

  // Only add neighbors every NEIGHBOR_ADD_INTERVAL frames
  if ((row !== currentRow || col !== currentCol) && frameCounter % NEIGHBOR_ADD_INTERVAL === 0) {
    currentRow = row;
    currentCol = col;
    allNeighbors.push(...getRandomNeighbors(row, col));
  }

  for (let neighbor of allNeighbors) {
    const x = neighbor.col * CELL_SIZE;
    const y = neighbor.row * CELL_SIZE;
    neighbor.opacity = max(0, neighbor.opacity - FADE_SPEED);
    stroke(COLOR_R, COLOR_G, COLOR_B, neighbor.opacity);
    rect(x, y, CELL_SIZE, CELL_SIZE);
  }

  // Cleanup faded-out neighbors
  allNeighbors = allNeighbors.filter(n => n.opacity > 0);
  frameCounter++;
}

function getRandomNeighbors(row, col) {
  const neighbors = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const nr = row + dr, nc = col + dc;
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

// Expose to p5 global
window.setup = setup;
window.draw = draw;
window.windowResized = windowResized;
