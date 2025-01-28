let flipped = false;
let prevFlipped = true;
const maxBlue = 239;
const minBlue = 0;
const howManyPixels = 50000;
const width = 1000;
const height = 1000;
const averageOfMiddles = (width + height) / 4;
const spikeWidthMultiplier = 1.5;
const spikes = getRandomInts(0, 8, howManyPixels).sort().reverse();
const unflipChance = howManyPixels / 500000;
const redrawChance = 10000 / howManyPixels;

function setup() {
  createCanvas(width, height);
  noStroke();

}

function draw() {
  if (flipped === prevFlipped && Math.random() > redrawChance) {
    let chance = flipped ? unflipChance : 0.005;
    if (Math.random() > chance) {
      return;
    } else {
      flipped = !flipped;
    }
  }
  prevFlipped = flipped;
  if (flipped) {
    background(255-130, 255-200, 255-255);
  } else {
    background(130, 200, 255);
  }
  let redAndGreen = flipped ? 0 : 255;

  for (let i = 0; i < howManyPixels; i++) {
    if (spikes[i] >= 4) {
      let x = randomGaussian(width / 2, width / 8);
      let y = randomGaussian(height / 2, height / 8);
      const nearCenter = (Math.abs(x - width / 2) + Math.abs(y - height / 2)) / 2;
      const howMuchBlue = (((averageOfMiddles - nearCenter) / averageOfMiddles) * (maxBlue - minBlue)) + minBlue;
      if (flipped) {
        x = flipAwayFromCenter(x, width);
        y = flipAwayFromCenter(y, height);
      }
      fill(255, 255, howMuchBlue);
      rect(x, y, 20, 20);
    } else {
      let x;
      let y;
      let howMuchBlue;
      let arbitraryBlueToAdd = 0;
      if (spikes[i] === 0) {
        y = getRandomInts(0, height / 2, 1)[0];
        x = randomGaussian(width / 2, (width / 25) * (y / (height / 2) + Math.random() / spikeWidthMultiplier));
        arbitraryBlueToAdd = (width / 10 - Math.abs((width / 2) - x)) ** 2 / (width / 10);
      } else if (spikes[i] === 1) {
        y = getRandomInts(height / 2, height, 1)[0];
        x = randomGaussian(width / 2, (width / 25) * (((height / 2) - (y - (height / 2))) / (height / 2) + (Math.random() / spikeWidthMultiplier)));
        arbitraryBlueToAdd = (width / 10 - Math.abs((width / 2) - x)) ** 2 / (width / 10);
      } else if (spikes[i] === 2) {
        x = getRandomInts(0, width / 2, 1)[0];
        y = randomGaussian(height / 2, (height / 25) * (x / (width / 2) + Math.random() / spikeWidthMultiplier));
        arbitraryBlueToAdd = (height / 10 - Math.abs((height / 2) - y)) ** 2 / (height / 10);
      } else if (spikes[i] === 3) {
        x = getRandomInts(width / 2, width, 1)[0];
        y = randomGaussian(height / 2, (height / 25) * (((width / 2) - (x - (width / 2))) / (width / 2) + (Math.random() / spikeWidthMultiplier)));
        arbitraryBlueToAdd = (height / 10 - Math.abs((height / 2) - y)) ** 2 / (height / 10);
      }
      const nearCenter = (Math.abs(x - width / 2) + Math.abs(y - height / 2)) / 2;
      howMuchBlue = (((averageOfMiddles - nearCenter) / averageOfMiddles) * (maxBlue - minBlue)) + minBlue + arbitraryBlueToAdd;

      fill(redAndGreen, redAndGreen, howMuchBlue);
      rect(x, y, 20, 20);;
    }
  }
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
    numbers.push(Math.floor(Math.random() * (max - min) + min));
  }
  return numbers;
}

function mousePressed(e) {
  if (e.button === 0) {
    flipped = !flipped;
  }
}

function flipAwayFromCenter(number, size) {
  if (number < size / 2) {
    return size / 2 - number;
  } else if (number > size / 2) {
    return (size / 2) - (number - (size / 2)) + (size / 2)
  }
  return number;
}