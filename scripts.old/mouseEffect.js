let currentRow = -2;
let currentCol = -2;
let allNeighbors = [];

const CELL_SIZE = 40;
const COLOR_R = 123;
const COLOR_G = 175;
const COLOR_B = 212;
const AMT_FADE_PER_FRAME = 5;

function setup() {
    let cnv = createCanvas(windowWidth, windowHeight);
    cnv.parent(document.body);
    cnv.id('gridCanvas');
    cnv.style('z-index', '-1');
    clear();
    noFill();
    strokeWeight(1);
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
            if ((dr !== 0 || dc !== 0) && nr >= 0 && nc >= 0 && nr < height / CELL_SIZE && nc < width / CELL_SIZE && Math.random() < 0.5) {
                neighbors.push({ row: nr, col: nc, opacity: 255 });
            }
        }
    }
    return neighbors;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

// scripts/mouseEffect.js --- IGNORE ---
// This script handles the mouse effect on the grid canvas, creating a dynamic interaction based on mouse movement.
// It generates a grid of rectangles that fade out over time, creating a visually appealing effect as the mouse moves across the canvas.
// The grid is responsive to window resizing, ensuring the effect remains consistent across different screen sizes.
// The grid is drawn using p5.js, which allows for easy manipulation of canvas elements and smooth animations.
// The effect is designed to be lightweight and efficient, with fading rectangles that do not overwhelm the browser's rendering capabilities.
// The script is intended to be used in conjunction with a p5.js setup, where the canvas is created and the draw loop is managed.
// The mouse effect enhances user engagement by providing a visually stimulating background that reacts to user input, making the website feel more interactive and alive.
// The grid canvas is set up to cover the entire window, and the rectangles are drawn based on the mouse's position, creating a ripple effect as the user moves the mouse across the screen.
//// The fading effect is controlled by a constant amount of fade per frame, ensuring a smooth transition as the rectangles lose opacity over time.
// The script is modular and can be easily integrated into any p5.js project, allowing for quick setup and customization.
// It is designed to be visually appealing while maintaining performance, making it suitable for modern web applications that require dynamic visual effects without compromising on speed or responsiveness.
//// The mouse effect can be further customized by adjusting the constants for cell size, color, and fade parameters, allowing developers to tailor the effect to fit their website's design and aesthetic preferences.
// The script is lightweight and does not rely on external libraries beyond p5.js, ensuring compatibility with a wide range of web projects.
// It is a great example of how simple interactions can enhance the user experience on a website, making it more engaging and visually interesting.
// The mouse effect is particularly useful for portfolios, personal websites, or any site that aims to