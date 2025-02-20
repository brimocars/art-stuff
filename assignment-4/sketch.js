let width = window.innerWidth;
let height = window.innerHeight;

let areSlidersBelow;
if (width >= height) {
  areSlidersBelow = false;
  width = width - 200;
} else {
  areSlidersBelow = true;
  height = height - 200;
}

let generation;
let circleDiameterSlider;
let startingXSlider;
let startingYSlider ;

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
let generations;
const transformations = {
  '0': '',
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
  if (areSlidersBelow) {
    createCanvas(width, height + 500);
  } else {
    createCanvas(width + 200, height);
  }
  background(0, 0, 0);
  noLoop();
  angleMode(DEGREES);
  setUpSliders();


  // axiom = seed;
  // for (let i = 0; i < generations; i++) {
  //   let newString = '';
  //   for (let j = 0; j < axiom.length; j++) {
  //     newString += transformations[axiom[j]] ?? axiom[j]
  //   }
  //   axiom = newString;
  //   console.log(axiom);
  // }

  // fill(0, 255, 0);
  // stroke(120, 200, 120);
  // for (let i = 0; i < axiom.length; i++) {
  //   rules[axiom[i]]();
  // }
}

function draw() {
  generation = childRepulsionRangeSlider.value();
  state.leafDiameter = circleDiameterSlider.value();
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

function setUpSliders() {
  textSize(10);
  fill(255, 255, 255);

  // const button = createButton('Toggle mode');
  // button.size(170);
  // button.mouseClicked(() => nodeMode++);

  // const reflect = createButton('Toggle reflect');
  // reflect.size(170);
  // reflect.mouseClicked(() => reflectMode++);

  generationSlider = createSlider(1, 20, 5, 1);
  circleDiameterSlider = createSlider(1, 100, 50, 1);
  startingXSlider = createSlider(0, width, width / 2, 1);
  startingYSlider = createSlider(0, height, height / 2, 1);
  // wiggleChanceSlider = createSlider(0, 1, 0, 0.01);
  // childDistanceMultiplierSlider = createSlider(0, 3, 0.5, 0.1);
  // childColorRangeSlider = createSlider(0, 50, 20, 1);
  // childGenerationChanceSlider = createSlider(0, 0.5, 0.1, 0.001);
  // childSizeSlider = createSlider(1, 40, 28, 1);
  // maxChildsSlider = createSlider(10, 1000000, 1000, 10);
  // frameRateSlider = createSlider(1, 60, 60, 1);
  // percentOfNodesToHitBeforeStoppingSlider = createSlider(0, 1, 1, 0.01);

  if (areSlidersBelow) {
    rect(0, height, width, 200);
    fill(0, 0, 0);

    // button.position(10, height + 15);
    // reflect.position(10 + width/2, height + 15);
    
    textSize(10);

    text('Generation Slider', 10, height + 75);
    generationSlider.position(10, height + 90);

    text('Circle Diameter', 10, height + 140);
    circleDiameterSlider.position(10, height + 155);

    text('X', 10, height + 205);
    startingXSlider.position(10, height + 220);

    text('Y', 10, height + 270);
    startingYSlider.position(10, height + 285);

    // text('Chance to wiggle', 10, height + 335);
    // wiggleChanceSlider.position(10, height + 350);

    // text('Nodes to path through', 10, height + 405);
    // percentOfNodesToHitBeforeStoppingSlider.position(10, height + 420);

    // text('Child spawning distance multiplier', 200, height + 75);
    // childDistanceMultiplierSlider.position(200, height + 90);

    // text('Child color range', 200, height + 140);
    // childColorRangeSlider.position(200, height + 155);

    // text('Child generation chance', 200, height + 205);
    // childGenerationChanceSlider.position(200, height + 220);

    // text('Child Size', 200, height + 270);
    // childSizeSlider.position(200, height + 285);

    // text('Max childs (does not delete)', 200, height + 335);
    // maxChildsSlider.position(200, height + 350);

    // text('Frame rate', 200, height + 405);
    // frameRateSlider.position(200, height + 420);

  } else {
    rect(width, 0, 200, height);
    fill(0, 0, 0);

    // button.position(width + 10, 15);
    // reflect.position(width + 10, 40);

    textSize(10);

    text('Generation Slider', width + 10, 75);
    generationSlider.position(width + 10, 90);

    text('Circle Diameter', width + 10, 140);
    circleDiameterSlider.position(width + 10, 155);

    text('X', width + 10, 205);
    startingXSlider.position(width + 10, 220);

    text('Y', width + 10, 270);
    startingYSlider.position(width + 10, 285);

    // text('Chance to wiggle', width + 10, 335);
    // wiggleChanceSlider.position(width + 10, 350);

    // text('Child spawning distance multiplier', width + 10, 400);
    // childDistanceMultiplierSlider.position(width + 10, 415);

    // text('Child color range', width + 10, 465);
    // childColorRangeSlider.position(width + 10, 480);

    // text('Child generation chance', width + 10, 530);
    // childGenerationChanceSlider.position(width + 10, 545);

    // text('Child Size', width + 10, 595);
    // childSizeSlider.position(width + 10, 610);

    // text('Max childs (does not delete)', width + 10, 660);
    // maxChildsSlider.position(width + 10, 675);

    // text('Frame rate', width + 10, 725);
    // frameRateSlider.position(width + 10, 740);

    // text('Nodes to vertex through', width + 10, 785);
    // percentOfNodesToHitBeforeStoppingSlider.position(width + 10, 800);
  }
  generationSlider.size(170);
  circleDiameterSlider.size(170);
  startingYSlider.size(170);
  startingXSlider.size(170);
  // childGenerationChanceSlider.size(170);
  // childColorRangeSlider.size(170);
  // childDistanceMultiplierSlider.size(170);
  // wiggleChanceSlider.size(170);
  // pullFromParentForceSlider.size(170);
  // pushFromParentForceSlider.size(170);
  // childRepulsionForceSlider.size(170);
  // childRepulsionRangeSlider.size(170);
  textSize(40);
}