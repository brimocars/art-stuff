// TODO:
// Make 3d? or maybe it can just be 2d and that's fine.
// make the color selection more interesting?

const cellSize = 10;
const width = window.innerWidth - 200 - ((window.innerWidth - 200) % cellSize);
const height = window.innerHeight - ((window.innerHeight) % cellSize);
let cells = [];
let frameRateSlider;
let lastTouchedByAntToSetSlider;
let lastTouchedByAntToSet;
let layerSlider;
let howManyLayers;
let killSlider;
let killMode;
// let do3DSlider;
// let do3D;

let currentMouseDrag;

const randomStartingHue = 300;//getRandomInts(0, 360);
const colorHues = [0, 1, 2, 3, 4, 5, 6, 7].map((num) => randomStartingHue + num * 360 / 8);

const colors = colorHues.map((hue) => {
  return {
    ant: [weirdModThing(hue, 360), 50, 50],
    alive: [weirdModThing(hue, 360), 95, 30],
    dead: [hue, 95, 30, 0], // lol this doesn't matter, it's always fully transparent 
    aliveProtected: [weirdModThing(hue, 360), 95, 90],
  };
})

const possibleAnts = shuffle([
  'LR',
  'RL',
  'LRUN',
  'NUL',
  'UNRUL',
  'RLLR',
  'LRLRURLRL',
  'ULNNR',
]);

const ants = [];
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
  for (let i = 0; i < possibleAnts.length; i++) {
    const rowThing = []
    for (let j = 0; j < possibleAnts[i].length; j++) {
      rowThing.push(letterMappings[possibleAnts[i][j]]);
    }
    translatedTurns.push(rowThing);
  }

  frameRate(10);
  setUpControls();
}

function draw() {
  howManyLayers = layerSlider.value();
  killMode = killSlider.value() === 1;

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
      fill(...colors[layerIndex].aliveProtected, opacity);
      square(this.x, this.y, cellSize);
    } else if (this.isAlive) {
      fill(...colors[layerIndex].alive, opacity);
      square(this.x, this.y, cellSize);
    }
  }
}

function moveAnt(layerIndex) {
  const ant = ants[layerIndex]
  const currentCell = cells[layerIndex][ant.x][ant.y];
  ant.direction = (ant.direction + translatedTurns[layerIndex][currentCell.isAlive ? 1 : 0] + 4) % 4;
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

  push();
  fill(currentCell.isAlive ? colors[layerIndex].alive : colors[layerIndex].dead);
  square(currentCell.x, currentCell.y, cellSize);

  fill(...colors[layerIndex].ant);
  if (ant.x * cellSize + cellSize >= width) {
    rect(ant.x * cellSize - cellSize, ant.y * cellSize - cellSize, cellSize * 2, cellSize * 3)
  } else {
    square(ant.x * cellSize - cellSize, ant.y * cellSize - cellSize, cellSize * 3)
  }
  fill(0,0,0);
  square(ant.x * cellSize, ant.y * cellSize, cellSize)
  pop();
}

function mouseThing() {
  const rowClicked = cells[0][(mouseX - (mouseX % cellSize)) / cellSize];
  if (!rowClicked) {
    return;
  }
  const cellAtMouse = rowClicked[(mouseY - (mouseY % cellSize)) / cellSize]
  if (cellAtMouse && cellAtMouse !== currentMouseDrag) {
    currentMouseDrag = cellAtMouse;
    for (let i = 0; i <= howManyLayers; i++) {
      const cellsToChange = [];
      cellsToChange.push(cells[i][cellAtMouse.x / cellSize][cellAtMouse.y / cellSize]);

      if (killMode) {
        cellsToChange.push(cells[i][weirdModThing(cellAtMouse.x / cellSize - 1, cells[0].length)][cellAtMouse.y / cellSize]);
        cellsToChange.push(cells[i][weirdModThing(cellAtMouse.x / cellSize + 1, cells[0].length)][cellAtMouse.y / cellSize]);
        cellsToChange.push(cells[i][cellAtMouse.x / cellSize][weirdModThing(cellAtMouse.y / cellSize - 1, cells[0][0].length)]);
        cellsToChange.push(cells[i][cellAtMouse.x / cellSize][weirdModThing(cellAtMouse.y / cellSize + 1, cells[0][0].length)]);
        cellsToChange.push(cells[i][weirdModThing(cellAtMouse.x / cellSize - 1, cells[0].length)][weirdModThing(cellAtMouse.y / cellSize - 1, cells[0][0].length)]);
        cellsToChange.push(cells[i][weirdModThing(cellAtMouse.x / cellSize - 1, cells[0].length)][weirdModThing(cellAtMouse.y / cellSize + 1, cells[0][0].length)]);
        cellsToChange.push(cells[i][weirdModThing(cellAtMouse.x / cellSize + 1, cells[0].length)][weirdModThing(cellAtMouse.y / cellSize - 1, cells[0][0].length)]);
        cellsToChange.push(cells[i][weirdModThing(cellAtMouse.x / cellSize + 1, cells[0].length)][weirdModThing(cellAtMouse.y / cellSize + 1, cells[0][0].length)]);
        cellsToChange.forEach((cellToChange) => {
          cellToChange.isAlive = false;
        });
        fill(0, 0, 0);
        if (cellAtMouse.x + cellSize >= width) {
          rect(cellsToChange[0].x - cellSize, cellsToChange[0].y - cellSize, cellSize * 2, cellSize * 3);
        } else {
          square(cellsToChange[0].x - cellSize, cellsToChange[0].y - cellSize, cellSize * 3);
        }
      } else {
        cellsToChange[0].isAlive = !cellsToChange[0].isAlive
        cellsToChange[0].drawCell(i);
      }
    }
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

// Fisher-Yates shuffle algorithm from https://bost.ocks.org/mike/shuffle/
function shuffle(array) {
  let m = array.length, t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
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

  text('deadly cursor?', width + 10, 225);
  killSlider = createSlider(0, 1, 0, 1);
  killSlider.position(width + 10, 225);
  killSlider.size(160);
}