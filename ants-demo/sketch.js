const width = window.innerWidth;
const height = window.innerHeight;

const cellSize = 5;
const cellDirection = 'LLLRUNRUNRUN';
const letterMappings = {
  'L': -1,
  'R': 1,
  'U': 2,
  'N': 0,
}
const iterations = 10000;
let cells = [];
let stateColors = [];
let ant = { x: 0, y: 0, direction: 0 };
let translatedTurns = [];
let hitEdge = false;

function setup() {
  createCanvas(width, height);
  background(0, 0, 0);
  noStroke();

  cells.forEach((row) => row.length = 0);
  cells.length = 0;

  for (let x = 0; x < width / cellSize; x++) {
    cells.push([]);
    for (let y = 0; y < height / cellSize; y++) {
      cells[x].push({ x, y, state: 0 });
    }
  }

  ant.x = Math.floor(cells.length / 2);
  ant.y = Math.floor(cells[0].length / 2);
  ant.direction = 0;

  stateColors.length = 0;
  for (let i = 0; i < cellDirection.length; i++) {
    stateColors.push(color(i / cellDirection.length * 255, i / cellDirection.length * 255, i / cellDirection.length * 255));
  }

  translatedTurns.length = 0;
  for (let i = 0; i < cellDirection.length; i++) {
    translatedTurns.push(letterMappings[cellDirection[i]]);
  }

  for (let i = 0; i < iterations; i++) {
    if (moveAnt(false)) {
      i = iterations;
      hitEdge = true;
    }
  }

  for (let x = 0; x < cells.length; x++) {
    for (let y = 0; y < cells[0].length; y++) {
      const currentCell = cells[x][y];
      fill(stateColors[currentCell.state])
      square(currentCell.x * cellSize, currentCell.y * cellSize, cellSize);
    }
  }
}

function draw() {
  if (!hitEdge) {
    moveAnt(true);
  }
}

function moveAnt(shouldDraw) {
  const currentCell = cells[ant.x][ant.y];
  ant.direction = (ant.direction + translatedTurns[currentCell.state] + 4) % 4;
  currentCell.state = (currentCell.state + 1) % translatedTurns.length;

  switch (ant.direction) {
    case 0: ant.y -= 1; break;
    case 1: ant.x += 1; break;
    case 2: ant.y += 1; break;
    case 3: ant.x -= 1; break;
  }

  if (shouldDraw) {
    fill(stateColors[currentCell.state])
    square(currentCell.x * cellSize, currentCell.y * cellSize, cellSize);
  }

  if (ant.x >= width / cellSize || ant.x <= 0 || ant.y >= height / cellSize || ant.y <= 0) {
    console.log('reached edge of screen');
    noLoop();
    return true;
  }
  return false;
}
