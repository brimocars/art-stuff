const width = window.innerWidth;
const height = window.innerHeight;

let shaderProgram;
let vertexShader;
let fragShader;
const balls = [];
const acceleration = 1;
const size = 100;

function preload() {
  vertexShader = loadStrings('shader.vert');
  fragShader = loadStrings('shader.frag');
}

function setup() {
  pixelDensity(1);
  createCanvas(width, height, WEBGL);
  shaderProgram = createShader(vertexShader.join('\n'), fragShader.join('\n'));
  balls.push(new Ball(width / 2, 0, -1, acceleration));
}

function draw() {
  background(0);
  translate(-width/2, -height/2); //Preserve coordinate structure from 2D
  shader(shaderProgram);
  balls.forEach((ball) => {
    ball.update();
    ball.draw();
  });
  shaderProgram.setUniform('time', millis() / 1000)
  shaderProgram.setUniform('resolution', [width, height]);
  shaderProgram.setUniform('position', [balls[balls.length - 1].x, balls[balls.length - 1].y])
}

class Ball {
  constructor(x, y, velocity, acceleration) {
    this.x = x;
    this.y = y;
    this.velocity = velocity;
    this.acceleration = acceleration;
  }

  update() {
    this.velocity += this.acceleration;
    this.y += this.velocity
    if (this.y > height - size / 2) {
      this.velocity = -Math.abs(this.velocity * .85);
    }
    if (this.y > height - size / 2) {
      this.y = height - size / 2;
    }
  }

  draw() {
    circle(this.x, this.y, size);
  }
}

function mouseClicked() {
  balls.push(new Ball(mouseX, mouseY, -1, acceleration));
}

let mouseDragTimeout = false

function mouseDragged() {
  if (!mouseDragTimeout) {
    mouseDragTimeout = true
    setTimeout(() => {
      mouseDragTimeout = false
    }, 50);
    balls.push(new Ball(mouseX, mouseY, -1, acceleration));
  }
}

function keyPressed() { 
  if(keyCode === 32) {
    balls.forEach((ball) => {
      ball.y = getRandomInts(height * ball.x / width - 250, Math.min(height - 100, height * ball.x / width + 250));
      console.log(ball.y);
      ball.velocity = 1; 
      if (ball.y < 0) {
        ball.y = 0;
      }
    });
  }
}

/**
 * Gets an array of random numbers between min (inclusive) and max (exclusive)
 * @param {Number} min 
 * @param {Number} max 
 * @param {Number} howManyInts
 */
function getRandomInts(min, max, howManyInts = 1) {
  const numbers = [];
  for (let i = 0; i < howManyInts; i++) {
    numbers.push(Math.floor(Math.random() * (max - min) + min));
  }
  if (numbers.length === 1) {
    return numbers[0];
  }
  return numbers;
}