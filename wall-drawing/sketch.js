let width = window.innerWidth;
let height = window.innerHeight;

const gridNumber = Math.random() > 0.5 ? getRandomInts(1,5) : getRandomInts(20,100);

function setup() {
  createCanvas(width, height);
  noLoop();
  background(255, 255, 255);
  stroke(0,0,0)
  for(let i = 0; i < width; i+=width/gridNumber) {
    line(i, 0, i, height)
  }
  for (let j = 0; j < height; j+=height/gridNumber) {
    line(0, j, width, j)

  }
  strokeWeight(5)

  howMany = getRandomInts(12, 20);


  const xs = getRandomInts(0, gridNumber, howMany);
  const ys = getRandomInts(0, gridNumber, howMany);

  stroke(255, 0, 0);
  line(width / 2, 0, xs[0] * width/gridNumber, ys[0] * height/gridNumber);
  line(width / 2, height, xs[1] * width/gridNumber, ys[1] * height/gridNumber);
  line(width, height / 2, xs[2] * width/gridNumber, ys[2] * height/gridNumber);
  line(0, height / 2, xs[3] * width/gridNumber, ys[3] * height/gridNumber);

  stroke(0, 0, 255);
  line(0, 0, xs[4] * width/gridNumber, ys[4] * height/gridNumber);
  line(0, height, xs[5] * width/gridNumber, ys[5] * height/gridNumber);
  line(width, 0, xs[6] * width/gridNumber, ys[6] * height/gridNumber);
  line(width, height, xs[7] * width/gridNumber, ys[7] * height/gridNumber);

  stroke(255, 255, 0);
  for (let i = 8; i < xs.length; i++) {
    line(width/2, height/2, xs[i] * width/gridNumber, ys[i] * height/gridNumber);
  }
}

function draw() {

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