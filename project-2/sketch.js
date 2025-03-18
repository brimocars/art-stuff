/**
 * TODO:
 * - add more states, something with prevStates and branching paths maybe
 * - make mobile friendly?
 * - FIX NEIGHBORS
 */

const defaultCellSize = 25;

let width = window.innerWidth - 200 - ((window.innerWidth - 200) % defaultCellSize);
let height = window.innerHeight - ((window.innerHeight) % defaultCellSize);
const originalWidth = width;
const originalHeight = height;
let sectionWidth = width / 2;
let cells = [];
let frameRateSlider;
let currentMouseDrag;

let axiom;
const defaultState = {
  x: width * 3 / 4,
  y: height / 2,
  angle: 270,
  lineLength: 20,
  diameter: 2,
  h: 0,
};
let state = {};
const prevStates = [];

const transformations = {
  '0': '0',
  '1': '1',
  '+': '+',
  '-': '-',
}
const rules = {
  '0': () => {
    const endX = state.x + cos(state.angle) * state.lineLength;
    const endY = state.y + sin(state.angle) * state.lineLength
    const newEndX = (endX % sectionWidth) + sectionWidth
    const newEndY = ((endY + height) % height);

    // floating point error correction
    if (Math.abs(newEndX - endX) < 0.000001 && Math.abs(newEndY - endY) < 0.000001) {
      stroke(state.h, 50, 50);
      line(state.x, state.y, endX, endY);
    }
    if (newEndX + state.diameter / 2 <= width && newEndX - state.diameter / 2 >= sectionWidth) {
      circle(newEndX, newEndY, state.diameter);
    }
    state.x = newEndX;
    state.y = newEndY;
    state.h += 5;
    state.h = state.h % 360;
  },
  '1': () => {
    const endX = state.x + cos(state.angle) * state.lineLength;
    const endY = state.y + sin(state.angle) * state.lineLength
    const newEndX = (endX % sectionWidth) + sectionWidth
    const newEndY = ((endY + (height)) % height);

    if (Math.abs(newEndX - endX) < 0.000001 && Math.abs(newEndY - endY) < 0.000001) {
      stroke(state.h, 50, 50);
      line(state.x, state.y, endX, endY);
    }
    state.x = newEndX;
    state.y = newEndY;
    state.h += 5;
    state.h = state.h % 360;
  },
  '+': () => {
    state.angle -= 10;
  },
  '-': () => {
    state.angle += 10;
  },
}

let generationsSlider
let generations;
let lineLengthSlider;
let diameterSlider;
let input0;
let input1;
let inputPlus;
let inputMinus;
let aliveChanceSlider;
let cellSizeSlider;
let cellSize;

function setup() {
  doSetupStuff(true);
}

function doSetupStuff(firstTime = false) {
  if (firstTime) {
    createCanvas(width + 200, height);
    background(0);
    fill(255, 255, 255);
    stroke(0, 0, 0)
    rect(0, 0, sectionWidth, height);
    rect(sectionWidth, 0, sectionWidth, height);
    rect(width, 0, 200, height);
    setUpControls();
    angleMode(DEGREES);
    colorMode('hsl');
    noStroke();
  } else {
    cells.length = 0;
    axiom = '';
    draw();
  }

  axiom = '';
  for (let i = 0; i < generations; i++) {
    let newString = '';
    for (let j = 0; j < axiom.length; j++) {
      newString += transformations[axiom[j]] ?? axiom[j]
    }
    axiom = newString;
  }

  regenerateCells();
}

function draw() {
  push();
  fill(100, 100, 100);
  stroke(0, 0, 0);
  rect(0, 0, sectionWidth, height);
  rect(sectionWidth, 0, sectionWidth, height);
  pop()

  defaultState.lineLength = lineLengthSlider.value();
  defaultState.diameter = diameterSlider.value();
  transformations['0'] = input0.value();
  transformations['1'] = input1.value();
  transformations['+'] = inputPlus.value();
  transformations['-'] = inputMinus.value();
  
  updateCells();
  cells.forEach((row) => {
    row.forEach((c) => {
      c.drawCell();
    })
  })
  regenerateAxiom();
}

function regenerateAxiom() {
  generations = generationsSlider.value();
  axiom = '';
  cells.forEach((row) => {
    let alivitivity = 0
    row.forEach((c) => {
      axiom += c.isAlive ? '1' : '0';
      alivitivity += c.isAlive;
    })
    axiom += alivitivity > 0 ? '+' : '-';
  })

  for (let i = 0; i < generations; i++) {
    let newString = '';
    for (let j = 0; j < axiom.length; j++) {
      newString += transformations[axiom[j]] ?? axiom[j]
    }
    axiom = newString;
  }

  state = structuredClone(defaultState);
  push();
  fill(100, 100, 100);
  rect(sectionWidth, 0, sectionWidth, height);
  pop();

  push();
  fill(0, 0, 0);
  stroke(0, 0, 0);
  strokeWeight(5);
  for (let i = 0; i < axiom.length; i++) {
    rules[axiom[i]]();
  }
  pop();
}

function updateCells() {
  const newCells = [];

  for (let i = 0; i < cells.length; i++) {
    const newRow = [];
    for (let j = 0; j < cells[0].length; j++) {
      const currentCell = cells[i][j];
      const neighborsAlive = currentCell.calculateNeighborsAlive();
      if (currentCell.isAlive) {
        if (neighborsAlive < 2 || neighborsAlive > 3) {
          currentCell.isAlive = false;
        }
      } else {
        if (neighborsAlive === 3) {
          currentCell.isAlive = true;
        }
      }
      newRow.push(currentCell);
    }
    newCells.push(newRow);
  }
  cells = newCells;
}

class Cell {
  constructor(x, y, isAlive) {
    this.x = x;
    this.y = y;
    this.isAlive = isAlive;
    this.neighbors = [];
  }

  drawCell() {
    if (this.isAlive) {
      fill(0, 0, 0);
    } else {
      fill(255, 255, 255);
    }
    square(this.x, this.y, cellSize)
  }

  calculateNeighborsAlive() {
    return this.neighbors.filter((neighbor) => neighbor.isAlive).length;
  }
}

function regenerateCells() {
  push();
  fill(255, 255, 255);
  rect(0, 0, originalWidth, originalHeight);
  pop();
  cellSize = cellSizeSlider.value();
  width = window.innerWidth - 200 - ((window.innerWidth - 200) % cellSize);
  height = window.innerHeight - ((window.innerHeight) % cellSize);
  sectionWidth = width / 2;

  cells.length = 0;
  for (let x = 0; x < sectionWidth; x += cellSize) {
    const row = [];
    for (let y = 0; y < height; y += cellSize) {
      row.push(new Cell(x, y, Math.random() < aliveChanceSlider.value() / 100))
    }
    cells.push(row);
  }

  for (let x = 0; x < cells.length; x++) {
    for (let y = 0; y < cells[x].length; y++) {
      const neighbors = [];
      neighbors.push(cells[weirdModThing(x+1, cells.length)][weirdModThing(y-1, cells[x].length)])
      neighbors.push(cells[weirdModThing(x+1, cells.length)][weirdModThing(y, cells[x].length)])
      neighbors.push(cells[weirdModThing(x+1, cells.length)][weirdModThing(y+1, cells[x].length)])
      neighbors.push(cells[weirdModThing(x, cells.length)][weirdModThing(y+1, cells[x].length)])
      neighbors.push(cells[weirdModThing(x, cells.length)][weirdModThing(y-1, cells[x].length)])
      neighbors.push(cells[weirdModThing(x-1, cells.length)][weirdModThing(y+1, cells[x].length)])
      neighbors.push(cells[weirdModThing(x-1, cells.length)][weirdModThing(y, cells[x].length)])
      neighbors.push(cells[weirdModThing(x-1, cells.length)][weirdModThing(y-1, cells[x].length)])
      cells[x][y].neighbors = neighbors;
    }
  }
}

function weirdModThing(numberToMod, total) {
  return (numberToMod + total) % total;
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

function mouseThing() {
  const rowClicked = cells[(mouseX - (mouseX % cellSize)) / cellSize];
  if (!rowClicked) {
    return;
  }
  const cellAtMouse = rowClicked[(mouseY - (mouseY % cellSize)) / cellSize]
  if (cellAtMouse && cellAtMouse !== currentMouseDrag) {
    cellAtMouse.isAlive = !cellAtMouse.isAlive
    cellAtMouse.drawCell();
    regenerateAxiom();
    currentMouseDrag = cellAtMouse;
  };
}

function mousePressed() {
  mouseThing()
}

function mouseDragged() {
  mouseThing()
}

function mouseReleased() {
  currentMouseDrag = undefined;
}

function setUpControls() {
  push();
  textSize(15);
  fill(0, 0, 0);
  noStroke();

  text('Framerate', width + 10, 25);
  frameRateSlider = createSlider(0, 20, 1, 1);
  frameRateSlider.position(width + 10, 25);
  frameRateSlider.size(160);
  frameRateSlider.mouseClicked(() => frameRate(frameRateSlider.value()))
  frameRate(frameRateSlider.value())

  text('Generations', width + 10, 65);
  generationsSlider = createSlider(0, 5, 1, 1);
  generationsSlider.position(width + 10, 65);
  generationsSlider.size(160);
  generationsSlider.mouseReleased(regenerateAxiom)

  text('Line Length', width + 10, 105);
  lineLengthSlider = createSlider(1, 50, 10, 1);
  lineLengthSlider.position(width + 10, 105);
  lineLengthSlider.size(160);  

  text('Node Diameter', width + 10, 145);
  diameterSlider = createSlider(1, 50, 20, 1);
  diameterSlider.position(width + 10, 145);
  diameterSlider.size(160);  

  text('These text inputs define the rules for the l-system:', width + 10, 195, 160, 100);

  text('0 (draw line with circle)', width + 10, 270);
  input0 = createInput('10-');
  input0.position(width + 10, 275);
  input0.size(160);

  text('1 (draw line)', width + 10, 320);
  input1 = createInput('11+1');
  input1.position(width + 10, 325);
  input1.size(160);

  text('+ (increase angle)', width + 10, 370);
  inputPlus = createInput('+');
  inputPlus.position(width + 10, 375);
  inputPlus.size(160);

  text('- (decrease angle)', width + 10, 420);
  inputMinus = createInput('-');
  inputMinus.position(width + 10, 425);
  inputMinus.size(160);

  text('Cell alive chance (when regenerating)', width + 10, 550, 160, 60);
  aliveChanceSlider = createSlider(0, 100, 50, 1);
  aliveChanceSlider.position(width + 10, 580);
  aliveChanceSlider.size(160);

  text('Cell size (when regenerating)', width + 10, 600, 160, 60);
  cellSizeSlider = createSlider(10, 100, defaultCellSize, 1);
  cellSizeSlider.position(width + 10, 630);
  cellSizeSlider.size(160);
  cellSize = cellSizeSlider.value();

  const button = createButton('Regenerate Game of Life');
  button.size(180);
  button.mouseClicked(() => {
    doSetupStuff(); 
    draw();
  });
  button.position(width + 10, 690);
  pop();
}