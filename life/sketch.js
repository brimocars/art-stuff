const width = 800;
const height = 800;
const cellSize = 10;
let cells = [];
let frameRateSlider;

function setup() {
  createCanvas(width + 100, height);
  noStroke();
  fill(100,100,100)
  rect(width, 0, 100, height)

  for(let x = 0; x < width; x += cellSize) {
    const row = [];
    for(let y = 0; y < width; y += cellSize) {
      row.push(new Cell(x, y, Math.random() > 0.9))
    }
    cells.push(row);
  }
  frameRate(10);
  setUpControls();
}

function draw() {
  cells.forEach((row) => {
    row.forEach((c) => {
      c.drawCell();
    })
  })
  updateCells();
}

function updateCells() {
  const newCells = [];

  for (let i = 0; i < cells.length; i++) {
    const newRow = [];
    for (let j = 0; j < cells[0].length; j++) {
      const currentCell = cells[i][j];
      const newCell = new Cell(currentCell.x, currentCell.y, currentCell.isAlive);
      let neighborsAlive = 0;
      if (cells[((i-1) + cells.length) % cells.length]?.[((j) + cells[0].length) % cells[0].length]?.isAlive) {
        neighborsAlive++;
      }
      if (cells[((i+1) + cells.length) % cells.length]?.[((j) + cells[0].length) % cells[0].length]?.isAlive) {
        neighborsAlive++;
      }
      if (cells[((i-1) + cells.length) % cells.length]?.[((j+1) + cells[0].length) % cells[0].length]?.isAlive) {
        neighborsAlive++;
      }
      if (cells[((i) + cells.length) % cells.length]?.[((j+1) + cells[0].length) % cells[0].length]?.isAlive) {
        neighborsAlive++;
      }
      if (cells[((i+1) + cells.length) % cells.length]?.[((j+1) + cells[0].length) % cells[0].length]?.isAlive) {
        neighborsAlive++;
      }
      if (cells[((i-1) + cells.length) % cells.length]?.[((j-1) + cells[0].length) % cells[0].length]?.isAlive) {
        neighborsAlive++;
      }
      if (cells[((i) + cells.length) % cells.length]?.[((j-1) + cells[0].length) % cells[0].length]?.isAlive) {
        neighborsAlive++;
      }
      if (cells[((i+1) + cells.length) % cells.length]?.[((j-1) + cells[0].length) % cells[0].length]?.isAlive) {
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
      newRow.push(newCell);
    }
    newCells.push(newRow);
  }
  cells = newCells;
}

class Cell {
  constructor(x, y, isAlive) {
    this.x = x;
    this.y = y;
    this.isAlive = isAlive
  }

  drawCell() {
    if (this.isAlive) {
      fill(0,0,0);
    } else {
      fill(255, 255, 255);
    }
    rect(this.x, this.y, cellSize, cellSize)
  }
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
  
  textSize(10)
  fill(0,0,0)
  
  text('Framerate', width + 10, 75)
  frameRateSlider = createSlider(0, 60, 15, 1);
  frameRateSlider.position(width + 10, 75);
  frameRateSlider.size(80);
  frameRateSlider.mouseClicked(() => frameRate(frameRateSlider.value()))
}