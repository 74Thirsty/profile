const CELL_SIZE = 40;
const COLOR_R = 123;
const COLOR_G = 175;
const COLOR_B = 212;
const STARTING_ALPHA = 0;
const BACKGROUND_COLOR = [26, 26, 26];
const PROB_OF_NEIGHBOR = 0.5; // Probability to generate neighboring cells
const AMT_FADE_PER_FRAME = 5; // Amount of fading per frame

let numRows, numCols;
let currentRow = -2, currentCol = -2;
let allNeighbors = [];

function setup() {
    let cnv = createCanvas(windowWidth, windowHeight);  // Set canvas size to window size
    cnv.parent(document.body);
    cnv.id('gridCanvas'); 
    cnv.style('z-index', '-1'); // Ensures canvas stays behind content
    clear();
    noFill();
    strokeWeight(1);

    numRows = ceil(windowHeight / CELL_SIZE);  // Number of rows based on canvas height
    numCols = ceil(windowWidth / CELL_SIZE);   // Number of columns based on canvas width
}

function draw() {
    clear(); // Clear the canvas every frame
    let row = floor(mouseY / CELL_SIZE);  // Calculate row based on mouse position
    let col = floor(mouseX / CELL_SIZE);  // Calculate column based on mouse position
    
    // Only update the neighbors if the mouse position changes
    if (row !== currentRow || col !== currentCol) {
        currentRow = row;
        currentCol = col;
        allNeighbors.push(...getRandomNeighbors(row, col));  // Add new neighbors near the current cell
    }
    
    // Draw the neighbors with fading effect
    for (let neighbor of allNeighbors) {
        let x = neighbor.col * CELL_SIZE;
        let y = neighbor.row * CELL_SIZE;

        // Fade out neighbors over time
        neighbor.opacity = max(0, neighbor.opacity - AMT_FADE_PER_FRAME);
        
        // Set stroke color and opacity
        stroke(COLOR_R, COLOR_G, COLOR_B, neighbor.opacity);
        rect(x, y, CELL_SIZE, CELL_SIZE);  // Draw the grid cell
    }
    
    // Remove neighbors that have completely faded out
    allNeighbors = allNeighbors.filter(n => n.opacity > 0);
}

// Generates neighbors around the current grid cell (mouse position)
function getRandomNeighbors(row, col) {
    let neighbors = [];
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            let nr = row + dr, nc = col + dc;
            // Ensure the neighbor is within bounds and has a certain probability of being created
            if ((dr !== 0 || dc !== 0) && nr >= 0 && nc >= 0 && nr < numRows && nc < numCols && Math.random() < PROB_OF_NEIGHBOR) {
                neighbors.push({ row: nr, col: nc, opacity: 255 });  // Add new neighbor with full opacity
            }
        }
    }
    return neighbors;
}

// Adjust canvas size when the window is resized
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    numRows = ceil(windowHeight / CELL_SIZE);
    numCols = ceil(windowWidth / CELL_SIZE);
}
