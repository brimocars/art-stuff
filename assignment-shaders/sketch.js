const width = window.innerWidth - 200;
const height = window.innerHeight;

let shaderProgram;
let vertexShader;
let fragShader;
const balls = [];
let randomBall;
let mouseDragTimeout = false;

let accelerationSlider;
let acceleration = 1;
let sizeSlider;
let size = 100;


function preload() {
  vertexShader = loadStrings('shader.vert');
  fragShader = loadStrings('shader.frag');
}

function setup() {
  pixelDensity(1);
  createCanvas(width + 200, height, WEBGL);
  setUpControls();
  shaderProgram = createShader(vertexShader.join('\n'), fragShader.join('\n'));
  balls.push(new Ball(width / 2, 0, -1, acceleration));
  randomBall = balls[0];
}

function draw() {
  acceleration = accelerationSlider.value();
  size = sizeSlider.value();
  background(0);
  translate(-width/2, -height/2); //Preserve coordinate structure from 2D
  shader(shaderProgram);
  let speedTotal = 0;
  balls.forEach((ball) => {
    ball.update();
    ball.draw();
    speedTotal += Math.abs(ball.velocity);
  });
  const averageSpeed = speedTotal / balls.length / 100;
  shaderProgram.setUniform('time', millis() / 1000);
  shaderProgram.setUniform('resolution', [width, height]);
  shaderProgram.setUniform('position', [randomBall.x, randomBall.y]);
  shaderProgram.setUniform('averageSpeed', averageSpeed);
  shaderProgram.setUniform('width', width);
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
    this.y += this.velocity;
    if (this.y > height - size / 2) {
      this.velocity = -Math.abs(this.velocity * .85);
    }
    if (this.y > height - size / 2) {
      this.y = height - size / 2;
    }
    if (this.y < size / 2) {
      this.velocity = Math.abs(this.velocity * .85);
    }
    if (this.y <  size / 2) {
      this.y = size / 2;
    }
  }

  draw() {
    // I think something with the translation and the slider area makes this wrong, so adding 100 readjusts or
    // something. I don't know.
    circle(this.x - 100, this.y, size);
  }
}


function mousePressed() {
  if (mouseX > width && mouseY < 100) {
    return;
  }
  balls.push(new Ball(mouseX, mouseY, 1, acceleration));
  randomBall = balls[balls.length - 1]; // not random
  mouseDragTimeout = true;
  setTimeout(() => {
    mouseDragTimeout = false;
  }, 500);
}


function mouseDragged() {
  if (mouseX > width && mouseY < 100) {
    return;
  }
  if (!mouseDragTimeout) {
    mouseDragTimeout = true;
    setTimeout(() => {
      mouseDragTimeout = false;
    }, 50);
    balls.push(new Ball(mouseX, mouseY, 1, acceleration));
    randomBall = balls[getRandomInts(0, balls.length - 1)]; // random
  }
}

function keyPressed() { 
  if(keyCode === 32) {
    balls.forEach((ball) => {
      ball.y = getRandomInts(height / 2 - size, height / 2 + size);
      ball.velocity = 1; 
      if (ball.y < 0) {
        ball.y = 0;
      }
    });
    randomBall = balls[getRandomInts(0, balls.length - 1)]; // random
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

function setUpControls() {
  push();

  text('acceleration', width + 10, 25);
  accelerationSlider = createSlider(-5, 5, 1, 0.5);
  accelerationSlider.position(width + 10, 25);
  accelerationSlider.size(160);

  text('size', width + 10, 65);
  sizeSlider = createSlider(10, 400, 100, 5);
  sizeSlider.position(width + 10, 65);
  sizeSlider.size(160);
  pop();
}