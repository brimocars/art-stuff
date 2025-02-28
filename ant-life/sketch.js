const cellSize = 10;
const width = window.innerWidth - 200 - ((window.innerWidth - 200) % cellSize);
const height = window.innerHeight - ((window.innerHeight) % cellSize);
let cells = [];
let frameRateSlider;
let lastTouchedByAntToSetSlider;
let lastTouchedByAntToSet;

const ant = {
  x: getRandomInts(0, width / cellSize),
  y: getRandomInts(0, height / cellSize),
  direction: getRandomInts(0, 4, 1)
}
const cellDirection = 'LR';
const letterMappings = {
  'L': -1,
  'R': 1,
  'U': 2,
  'N': 0,
}
let translatedTurns = [];

function setup() {
  createCanvas(width + 200, height);
  noStroke();
  fill(200, 200, 200)
  rect(width, 0, 200, height)

  for (let x = 0; x < width; x += cellSize) {
    const row = [];
    for (let y = 0; y < height; y += cellSize) {
      row.push(new Cell(x, y, false));//Math.random() > 0.95))
    }
    cells.push(row);
  }

  translatedTurns.length = 0;
  for (let i = 0; i < cellDirection.length; i++) {
    translatedTurns.push(letterMappings[cellDirection[i]]);
  }

  frameRate(10);
  setUpControls();
}

function draw() {
  lastTouchedByAntToSet = lastTouchedByAntToSetSlider.value();
  cells.forEach((row) => {
    row.forEach((c) => {
      c.drawCell();
    })
  })
  updateCells();
  moveAnt();
}

function updateCells() {
  const newCells = [];

  for (let i = 0; i < cells.length; i++) {
    const newRow = [];
    for (let j = 0; j < cells[0].length; j++) {
      const currentCell = cells[i][j];
      const newCell = new Cell(currentCell.x, currentCell.y, currentCell.isAlive, currentCell.lastTouchedByAnt);
      if (newCell.lastTouchedByAnt > 0) {
        newCell.lastTouchedByAnt--;
      } else {
        let neighborsAlive = 0;
        if (cells[((i - 1) + cells.length) % cells.length]?.[((j) + cells[0].length) % cells[0].length]?.isAlive) {
          neighborsAlive++;
        }
        if (cells[((i + 1) + cells.length) % cells.length]?.[((j) + cells[0].length) % cells[0].length]?.isAlive) {
          neighborsAlive++;
        }
        if (cells[((i - 1) + cells.length) % cells.length]?.[((j + 1) + cells[0].length) % cells[0].length]?.isAlive) {
          neighborsAlive++;
        }
        if (cells[((i) + cells.length) % cells.length]?.[((j + 1) + cells[0].length) % cells[0].length]?.isAlive) {
          neighborsAlive++;
        }
        if (cells[((i + 1) + cells.length) % cells.length]?.[((j + 1) + cells[0].length) % cells[0].length]?.isAlive) {
          neighborsAlive++;
        }
        if (cells[((i - 1) + cells.length) % cells.length]?.[((j - 1) + cells[0].length) % cells[0].length]?.isAlive) {
          neighborsAlive++;
        }
        if (cells[((i) + cells.length) % cells.length]?.[((j - 1) + cells[0].length) % cells[0].length]?.isAlive) {
          neighborsAlive++;
        }
        if (cells[((i + 1) + cells.length) % cells.length]?.[((j - 1) + cells[0].length) % cells[0].length]?.isAlive) {
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
  cells = newCells;
}

class Cell {
  constructor(x, y, isAlive, lastTouchedByAnt) {
    this.x = x;
    this.y = y;
    this.isAlive = isAlive
    this.lastTouchedByAnt = lastTouchedByAnt ?? 0;
  }

  drawCell() {
    if (this.lastTouchedByAnt > 1 && this.isAlive) {
      fill(162, 162, 162);
    } else if (this.lastTouchedByAnt > 1 && !this.isAlive) {
      fill(94, 94, 94);
    } else if (this.isAlive) {
      fill(0, 0, 0);
    } else {
      fill(255, 255, 255);
    }
    square(this.x, this.y, cellSize)
  }
}

function moveAnt() {
  const currentCell = cells[ant.x][ant.y];
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
  console.log(ant);

  fill(255, 128, 0);
  square(ant.x * cellSize, ant.y * cellSize, cellSize)


  fill(currentCell.isAlive ? color(192, 192, 192) : color(64, 64, 64));
  square(currentCell.x * cellSize, currentCell.y * cellSize, cellSize);
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
}