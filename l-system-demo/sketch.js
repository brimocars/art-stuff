const width = window.innerWidth;
const height = window.innerHeight;

let axiom;
let state = {
  x: width / 2,
  y: height / 2,
  angle: 270,
  lineLength: 10,
  leafDiameter: 5,
};
const prevStates = [];

const seed = '0';
const generations = 4;
const transformations = {
  '0': '1[0]23[0]1',
  '1': '12131',
  '2': '0[2]0',
  '3': '0[3]0',
  '[': '[',
  ']': ']'
}
const rules = {
  '0': () => {
    console.log('drawing 0');
    const endX = state.x + cos(state.angle) * state.lineLength;
    const endY = state.y + sin(state.angle) * state.lineLength
    line(state.x, state.y, endX, endY);
    circle(endX, endY, state.leafDiameter);
    state.x = endX;
    state.y = endY;
  },
  '1': () => {
    console.log('drawing 1');
    const endX = state.x + cos(state.angle) * state.lineLength;
    const endY = state.y + sin(state.angle) * state.lineLength
    line(state.x, state.y, endX, endY);
    state.x = endX;
    state.y = endY;
  },
  '2': () => {
    console.log('drawing 2');
    state.angle += 10;
    const endX = state.x + cos(state.angle) * state.lineLength;
    const endY = state.y + sin(state.angle) * state.lineLength;
    line(state.x, state.y, endX, endY);
    circle(endX, endY, state.leafDiameter);
    state.x = endX;
    state.y = endY;
  },
  '3': () => {
    console.log('drawing 3');
    state.angle -= 10;
    const endX = state.x + cos(state.angle) * state.lineLength;
    const endY = state.y + sin(state.angle) * state.lineLength;
    line(state.x, state.y, endX, endY);
    circle(endX, endY, state.leafDiameter);
    state.x = endX;
    state.y = endY;
  },
  '[': () => {
    console.log('drawing [');
    prevStates.push(structuredClone(state));
    state.angle -= 10;
  },
  ']': () => {
    console.log('drawing ]');
    state = prevStates.pop();
    state.angle += 10;
  },
}

function setup() {
  createCanvas(width, height);
  background(0, 0, 0);
  angleMode(DEGREES);
  noLoop();

  axiom = seed;
  for (let i = 0; i < generations; i++) {
    let newString = '';
    for (let j = 0; j < axiom.length; j++) {
      newString += transformations[axiom[j]] ?? axiom[j]
    }
    axiom = newString;
    console.log(axiom);
  }

  fill(0, 255, 0);
  stroke(120, 200, 120);
  for (let i = 0; i < axiom.length; i++) {
    rules[axiom[i]]();
  }
}

function draw() {
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