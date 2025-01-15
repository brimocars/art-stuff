let totalLines = 0;
let boxCount = 0;
let x = 0;
let y = 0;
const boxSize = 100;
let stopDrawing = false;
let lerp;

function setup() {
  createCanvas(1000, 1000);
  background(0, 0, 0);
  lerp = color(250, 0, 250);
}

function draw() {
  if (stopDrawing) return;

  if (boxCount < 100) {
    drawRandomLine()
    boxCount++;
  } else {
    boxCount = 0;
    x++;
    lerp = color((10 - x) * 25, 0, (10 - y) * 25);
    if (x >= 10) {
      x = 0;
      y++;
      lerp = color((10 - x) * 25, 0, (10 - y) * 25);
      if (y >= 10) {
        stopDrawing = true
      }
    }
  }
}



function drawRandomLine() {
  const colorParams = getRandomInts(0, 256, 3);
  const randomColor = color(...colorParams);
  const strokeColor = lerpColor(lerp, randomColor, 0.5);
  stroke(strokeColor);
  
  const weight = getRandomInts(0, 10, 1);
  strokeWeight(weight);

  const xParams = getRandomInts(x * boxSize, (x + 1) * boxSize, 4);
  const yParams = getRandomInts(y * boxSize, (y + 1) * boxSize, 4);
  line(xParams[0], yParams[0], xParams[1], yParams[1]);
}

/**
 * Gets an array of random numbers between min (inclusive) and max (exclusive)
 * @param {Number} min 
 * @param {Number} max 
 * @param {Number} howManyInts
 */
function getRandomInts(min, max, howManyInts) {
  const numbers = [];
  for (let i = 0; i < howManyInts; i++) {
      numbers.push(Math.random() * (max - min) + min);
  }
  return numbers;
}
