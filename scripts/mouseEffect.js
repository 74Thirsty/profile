let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  background(0, 0, 0, 10);  // Transparent background for the effect
}

function draw() {
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.update();
    p.show();
    
    if (p.isOffScreen()) {
      particles.splice(i, 1); // Remove off-screen particles
    }
  }
}

function mouseMoved() {
  let p = new Particle(mouseX, mouseY);
  particles.push(p);
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(10, 30);
    this.alpha = 255;
  }

  update() {
    this.alpha -= 5;
    this.size *= 0.98;
  }

  show() {
    fill(255, this.alpha);
    ellipse(this.x, this.y, this.size);
  }

  isOffScreen() {
    return this.alpha <= 0 || this.size <= 1;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
