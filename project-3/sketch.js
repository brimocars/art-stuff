// TODO:
// Make the ants more visible somehow? Maybe 3x3? maybe black?
// Make each layer interact with the others. 3d.

const cellSize = 10;
const width = window.innerWidth - 200 - ((window.innerWidth - 200) % cellSize);
const height = window.innerHeight - ((window.innerHeight) % cellSize);
let cells = [];
let frameRateSlider;
let lastTouchedByAntToSetSlider;
let lastTouchedByAntToSet;
let layerSlider;
let howManyLayers;

let testSlider;
let test;

const colorHues = [0, 1, 2, 3, 4, 5, 6, 7].map((num) => num * 360 / 8);

const colors = colorHues.map((hue) => {
  return {
    ant: [weirdModThing(hue, 360), 50, 50],
    alive: [hue, 95, 30],
    dead: [hue, 95, 30, 0], //lol this doesn't matter, it's always fully transparent 
    aliveProtected: [hue, 95, 90],
    deadProtected: [hue, 95, 90, 0],
  };
})

const ants = [];
const cellDirection = 'LR';
const letterMappings = {
  'L': -1,
  'R': 1,
  'U': 2,
  'N': 0,
};
let translatedTurns = [];

function setup() {
  colorMode(HSL);
  createCanvas(width + 200, height);
  noStroke();
  fill(0, 0, 100)
  rect(width, 0, 200, height)

  for (let i = 0; i < colors.length; i++) {
    ants.push({
      x: getRandomInts(0, width / cellSize),
      y: getRandomInts(0, height / cellSize),
      direction: getRandomInts(0, 4, 1)
    });
  };

  for (let layerNum = 0; layerNum < colors.length; layerNum++) {
    const layer = [];
    for (let x = 0; x < width; x += cellSize) {
      const row = [];
      for (let y = 0; y < height; y += cellSize) {
        row.push(new Cell(x, y, false));
      }
      layer.push(row);
    }
    cells.push(layer);
  }

  translatedTurns.length = 0;
  for (let i = 0; i < cellDirection.length; i++) {
    translatedTurns.push(letterMappings[cellDirection[i]]);
  }

  frameRate(10);
  setUpControls();
}

function draw() {
  test = testSlider.value();
  howManyLayers = layerSlider.value();
  push();
  fill(0, 0, 100);
  rect(0, 0, width, height);
  pop();

  lastTouchedByAntToSet = lastTouchedByAntToSetSlider.value();
  for (let i = 0; i <= howManyLayers; i++) {
    cells[i].forEach((row) => {
      row.forEach((c) => {
        c.drawCell(i);
      })
    })
    cells[i] = updateCells(cells[i]);
    moveAnt(i);
  }
}

function updateCells(layer) {
  const newCells = [];

  for (let i = 0; i < layer.length; i++) {
    const newRow = [];
    for (let j = 0; j < layer[0].length; j++) {
      const currentCell = layer[i][j];
      const newCell = new Cell(currentCell.x, currentCell.y, currentCell.isAlive, currentCell.lastTouchedByAnt);
      if (newCell.lastTouchedByAnt > 0) {
        newCell.lastTouchedByAnt--;
      } else {
        let neighborsAlive = 0;
        if (layer[((i - 1) + layer.length) % layer.length]?.[((j) + layer[0].length) % layer[0].length]?.isAlive) {
          neighborsAlive++;
        }
        if (layer[((i + 1) + layer.length) % layer.length]?.[((j) + layer[0].length) % layer[0].length]?.isAlive) {
          neighborsAlive++;
        }
        if (layer[((i - 1) + layer.length) % layer.length]?.[((j + 1) + layer[0].length) % layer[0].length]?.isAlive) {
          neighborsAlive++;
        }
        if (layer[((i) + layer.length) % layer.length]?.[((j + 1) + layer[0].length) % layer[0].length]?.isAlive) {
          neighborsAlive++;
        }
        if (layer[((i + 1) + layer.length) % layer.length]?.[((j + 1) + layer[0].length) % layer[0].length]?.isAlive) {
          neighborsAlive++;
        }
        if (layer[((i - 1) + layer.length) % layer.length]?.[((j - 1) + layer[0].length) % layer[0].length]?.isAlive) {
          neighborsAlive++;
        }
        if (layer[((i) + layer.length) % layer.length]?.[((j - 1) + layer[0].length) % layer[0].length]?.isAlive) {
          neighborsAlive++;
        }
        if (layer[((i + 1) + layer.length) % layer.length]?.[((j - 1) + layer[0].length) % layer[0].length]?.isAlive) {
          neighborsAlive++;
        }

        if (currentCell.isAlive) {
          if (neighborsAlive < 2 || neighborsAlive > 3) {
            newCell.isAlive = false;
          }
        } else {
          if (neighborsAlive === 3) {
            newCell.isAlive = true;
          }
        }
      }
      newRow.push(newCell);
    }
    newCells.push(newRow);
  }
  layer = newCells;
  return layer;
}

class Cell {
  constructor(x, y, isAlive, lastTouchedByAnt) {
    this.x = x;
    this.y = y;
    this.isAlive = isAlive
    this.lastTouchedByAnt = lastTouchedByAnt ?? 0;
  }

  drawCell(layerIndex) {
    const opacity = 0.5;
    if (this.lastTouchedByAnt > 1 && this.isAlive) {
      //fill(0,0,0,1);
      fill(...colors[layerIndex].aliveProtected, opacity);
      square(this.x, this.y, cellSize);
    } else if (this.lastTouchedByAnt > 1 && !this.isAlive) {
      //fill(0,0,0,1);
      fill(...colors[layerIndex].deadProtected, opacity);
      square(this.x, this.y, cellSize);
    } else if (this.isAlive) {
      //fill(...colors[1], test);
      fill(...colors[layerIndex].alive, opacity);
      square(this.x, this.y, cellSize);
    } else {
      //fill(...colors[0]);
      fill(...colors[layerIndex].dead, opacity);
      square(this.x, this.y, cellSize);
    }
  }
}

function moveAnt(layerIndex) {
  const ant = ants[layerIndex]
  const currentCell = cells[layerIndex][ant.x][ant.y];
  ant.direction = (ant.direction + translatedTurns[currentCell.isAlive ? 1 : 0] + 4) % 4;
  currentCell.isAlive = !currentCell.isAlive;
  currentCell.lastTouchedByAnt = lastTouchedByAntToSet;
  switch (ant.direction) {
    case 0: ant.y -= 1; break;
    case 1: ant.x += 1; break;
    case 2: ant.y += 1; break;
    case 3: ant.x -= 1; break;
  }

  const cellsPerRow = Math.floor(width / cellSize);
  const cellsPerColumn = Math.floor(height / cellSize);
  ant.x = (ant.x + cellsPerRow) % cellsPerRow;
  ant.y = (ant.y + cellsPerColumn) % cellsPerColumn;

  fill(...colors[layerIndex].ant);
  square(ant.x * cellSize, ant.y * cellSize, cellSize)

  fill(currentCell.isAlive ? colors[layerIndex].alive : colors[layerIndex].dead);
  square(currentCell.x * cellSize, currentCell.y * cellSize, cellSize);
}

function weirdModThing(numberToMod, total) {
  return (numberToMod + total) % total;
}

function getRandomInts(min, max, howManyInts = 1) {
  if (howManyInts === 1) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  const numbers = [];
  for (let i = 0; i < howManyInts; i++) {
    numbers.push(Math.floor(Math.random() * (max - min) + min));
  }
  return numbers;
}

function setUpControls() {
  removeElements();

  textSize(14)
  fill(0, 0, 0)

  text('Framerate', width + 10, 75)
  frameRateSlider = createSlider(0, 60, 15, 1);
  frameRateSlider.position(width + 10, 75);
  frameRateSlider.size(160);
  frameRateSlider.mouseClicked(() => frameRate(frameRateSlider.value()))

  text('Ant protection duration', width + 10, 125)
  lastTouchedByAntToSetSlider = createSlider(0, 200, 50, 1);
  lastTouchedByAntToSetSlider.position(width + 10, 125);
  lastTouchedByAntToSetSlider.size(160);

  text('layer', width + 10, 175);
  layerSlider = createSlider(0, colors.length - 1, 0, 1);
  layerSlider.position(width + 10, 175);
  layerSlider.size(160);

  text('test', width + 10, 375);
  testSlider = createSlider(0, 1, 0.5, .1);
  testSlider.position(width + 10, 375);
  testSlider.size(160);
}