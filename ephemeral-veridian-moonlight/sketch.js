const width = window.innerWidth - 200;
const height = window.innerHeight;

// from https://en.wikipedia.org/wiki/Viridian
const veridian = [0, 127, 102];
const veridianGreen = [0, 150, 152];
const veridianSpanish = [0, 127, 92];
let timeThing = 0;
let earth;
let moon;
let cameraMode = true;
let previousCameraMode = false;

let speedSlider;
let timeFactor = 0.1;
let shinySlider;

let font;
function preload() {
  font = loadFont("ARIAL.TTF");
}

function setup() {
  createCanvas(width, height, WEBGL);
  angleMode(DEGREES);
  noStroke();

  earth = new SpaceThing(0, 0, 200, 27, [175, 238, 238], 23.5);
  moon = new SpaceThing(500, 0, 50, 1, veridian);
  setUpControls();
}

function draw() {
  if (cameraMode) {
    camera(0, 1000, 0, 0, 0, 0, 0, 0, -1);
    timeFactor = Math.pow(speedSlider.value(), 2);
  } else {
    camera(earth.size * sin(-timeThing * earth.rotationSpeed), 0, earth.size * cos(-timeThing * earth.rotationSpeed),
    500 * sin(-timeThing * earth.rotationSpeed), 0, 500 * cos(-timeThing * earth.rotationSpeed),
    0, -1, 0);
    timeFactor = speedSlider.value() / 10;
  }
  previousCameraMode = cameraMode;


  orbitControl();
  background(50);
  pointLight(255, 255, 255, -5000 * sin(timeThing / 12), 0, 5000 * cos(timeThing / 12));
  pointLight(veridian[0], veridian[1], veridian[2],
    500 * sin(-timeThing + 90), 0, 500 * cos(-timeThing + 90)
  );

  earth.draw();
  moon.draw();

  timeThing += timeFactor;
}

function keyPressed() {
  if (keyCode === 32) {
    cameraMode = !cameraMode;
  }
}


class SpaceThing {
  constructor(x, z, size, rotationSpeed, color, tilt) {
    this.x = x;
    this.z = z;
    this.size = size;
    this.rotationSpeed = rotationSpeed;
    this.color = color;
    this.tilt = tilt;
  }

  draw() {
    push();
    specularMaterial(...this.color);
    shininess(shinySlider.value())
    fill(...this.color);
    if (this.tilt) {
      rotate(this.tilt, [0, 0, 1]);
    }
    rotateY(-timeThing * this.rotationSpeed);
    translate(this.x, 0, this.z);
    sphere(this.size);
    pop();
  }
}

function setUpControls() {
  push();
  textSize(15);
  textFont(font)
  fill(0, 0, 0);

  text('speed', width + 10, 25);
  speedSlider = createSlider(0, 5, 1, 0.1);
  speedSlider.position(width + 10, 25);
  speedSlider.size(160);

  text('shininess', width + 10, 65,);
  shinySlider = createSlider(1, 100, 5, 1);
  shinySlider.position(width + 10, 65);
  shinySlider.size(160);
  pop();
}