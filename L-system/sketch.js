const width = window.innerWidth - 200;
const height = window.innerHeight;

let axiom;
const defaultState = {
  x: width / 2,
  y: height / 2,
  angle: 270,
  size: 20,
  distance: 0,
  squaresPerRing: 1,
  h: 0,
  s: 50,
  l: 50,
  startingAngle: 0,
};
let state;
const prevStates = [];

const seed = '0';
const generations = 6;
const transformations = {
  '0': '1-[0]-1',
  '1': '1[+]]1',
  '+': '-',
  '-': '+',
  '[': '[',
  ']': ']'
}
const rules = {
  '0': () => {
  },
  '1': () => {
    push();
    fill(state.h % 360, state.s, state.l);
    const ringAngleIncrement = 360 / state.squaresPerRing;
    for (let i = 0; i < state.squaresPerRing; i++) {
      push();
      const ringAngle = i * ringAngleIncrement + state.startingAngle;
      const x = state.x + cos(ringAngle) * state.distance;
      const y = state.y + sin(ringAngle) * state.distance;
      if (x < width - size/2) {
        translate(x, y);
        rotate(state.angle);
        square(0 - size / 2, 0 - size / 2, size);
      }
      pop();
    }
    state.squaresPerRing += 1
    state.distance += distanceIncrease;
    pop();
  },
  '+': () => {
    state.h += 10;
  },
  '-': () => {
    state.angle -= 10;
  },
  '[': () => {
    state.angle -= 20;
    state.startingAngle += startingAngleIncreasePer;
  },
  ']': () => {
    state.angle += 20;
  },
}

let startingColorSlider;
let startingAngleIncreasePerSlider;
let startingAngleIncreasePer;
let animationDurationSlider;
let distanceIncreaseSlider;
let distanceIncrease;
let sizeSlider;
let size;

let isAnimating = false;
let animationTimer = 0;
let animationTotalDuration;


function setup() {
  createCanvas(width + 200, height);
  background(0);
  fill(255, 255, 255);
  rect(width, 0, 200, height);

  setUpControls();

  angleMode(DEGREES);
  colorMode('hsl');
  noStroke();

  axiom = seed;
  for (let i = 0; i < generations; i++) {
    let newString = '';
    for (let j = 0; j < axiom.length; j++) {
      newString += transformations[axiom[j]] ?? axiom[j]
    }
    axiom = newString;
    console.log(axiom);
  }
}

function draw() {
  push();
  fill(0, 0, 0);
  rect(0, 0, width, height);
  pop()

  distanceIncrease = distanceIncreaseSlider.value();
  size = sizeSlider.value();

  if (!isAnimating) {
    state = structuredClone(defaultState);
    state.h = startingColorSlider.value();
    startingAngleIncreasePer = startingAngleIncreasePerSlider.value();
  } else {
    animationTotalDuration = animationDurationSlider.value();
    animationTimer += 1;
    if (animationTimer >= animationTotalDuration) {
      isAnimating = false;
    }
    const percent = animationTimer / animationTotalDuration;
    state = structuredClone(defaultState);
    state.h = percent * 360;
    startingAngleIncreasePer = percent * 360;
  }

  for (let i = 0; i < axiom.length; i++) {
    rules[axiom[i]]();
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
  textSize(10)
  fill(0, 0, 0)

  const button = createButton('Animate');
  button.position(width + 10, 15);
  button.size(80);
  button.mouseClicked(() => {
    isAnimating = !isAnimating;
    animationTimer = 0;
  });

  text('starting hue', width + 10, 75)
  startingColorSlider = createSlider(1, 360, 0, 1);
  startingColorSlider.position(width + 10, 75);
  startingColorSlider.size(160);

  text('starting angle increase per ring', width + 10, 115)
  startingAngleIncreasePerSlider = createSlider(0, 360, 0, 1);
  startingAngleIncreasePerSlider.position(width + 10, 115);
  startingAngleIncreasePerSlider.size(160);

  text('Animation duration', width + 10, 155)
  animationDurationSlider = createSlider(30, 1800, 600, 30);
  animationDurationSlider.position(width + 10, 155);
  animationDurationSlider.size(160);  

  text('Distance incrase', width + 10, 195)
  distanceIncreaseSlider = createSlider(.5, 50, 10, .5);
  distanceIncreaseSlider.position(width + 10, 195);
  distanceIncreaseSlider.size(160);  

  text('Size', width + 10, 235)
  sizeSlider = createSlider(1, 100, 20, 5);
  sizeSlider.position(width + 10, 235);
  sizeSlider.size(160);  
}