const width = 800;
const height = 800;
const fieldSpacing = 15;
const lineLength = 10;
const fields = [];
const diameter = 30
let maxSpeed = 1;
const eraserMax = 300;
let eraserTimer = 0;
const speedField = [];
let snakeSlider;
let circles = []
let allCircles = []
let isEraserOn = false;
let globalSpeedMultiplier = 1;
let globalSpeedSlider;
let teleportSlider;
let teleportChance;
let eraserSizeSlider;
let eraserSize;
let transparencyMultiplierSlider;
let transparencyMultiplier;

const eraser = {
  x: 0,
  color: [0,0,0],
  speedMultiplier: Math.random() * 1,
  level: 0,
}

const noiseSpeedDivisor = 5;
const noiseScale = 0.05;
const speedNoiseScale = 1;

function setup() {
  createCanvas(width + 100, height);
  background(0);
  fill(255, 255, 255);
  rect(width, 0, 100, height);
  angleMode(DEGREES)

  addNewField();
  setUpSpeedField();

  noStroke();
  makeCircles();

  setUpControls();
}

function draw() {
  if (circles.length !== snakeSlider.value()) {
    circles.length = 0;
    for (let i = 0; i < snakeSlider.value(); i++) {
      circles[i] = allCircles[i];
    }
  }

  globalSpeedMultiplier = globalSpeedSlider.value();
  teleportChance = 1 - teleportSlider.value();
  transparencyMultiplier = transparencyMultiplierSlider.value();

  circles.forEach((circ) => {
    fill(circ.color[0], circ.color[1], circ.color[2], 10 * globalSpeedMultiplier * transparencyMultiplier);


    const teleportNumber = Math.random();
    const smallTeleport = teleportNumber > teleportChance * 0.99
    const bigTeleport = teleportNumber > teleportChance
    if (bigTeleport) {
      circ.x = getRandomInts(0, height)
      circ.y = getRandomInts(0, height)
      circ.level += 1;
      if (!fields[circ.level]) {
        addNewField();
      }
    } else {
      let addedX = 0;
      let addedY = 0;
      if (smallTeleport) {
        addedX = getRandomInts(-10, 11)
        addedY = getRandomInts(-10, 11)
      }
      const angle = fields[circ.level][Math.floor(circ.x)][Math.floor(circ.y)].angle
      const speed = speedField[Math.floor(circ.x)][Math.floor(circ.y)].speed
      circ.x += cos(angle) * (circ.speedMultiplier * speed * globalSpeedMultiplier) + addedX;
      circ.y += sin(angle) * (circ.speedMultiplier * speed * globalSpeedMultiplier) + addedY;
      circ.x = (circ.x + fields[circ.level].length) % fields[circ.level].length
      circ.y = (circ.y + fields[circ.level][0].length) % fields[circ.level][0].length
    }
    circle(circ.x, circ.y, diameter);
  })

  if (isEraserOn && eraserTimer !== 0) {
    eraserSize = eraserSizeSlider.value();
    fill(...eraser.color);
    eraserTimer += 1;

    if (!fields[eraser.level]) {
      addNewField();
    }

    const angle = fields[eraser.level][Math.floor(eraser.x)][Math.floor(eraser.y)].angle
    eraser.x += cos(angle) * eraser.speedMultiplier * globalSpeedMultiplier;
    eraser.y += sin(angle) * eraser.speedMultiplier * globalSpeedMultiplier;
    eraser.x = (eraser.x + fields[eraser.level].length) % fields[eraser.level].length
    eraser.y = (eraser.y + fields[eraser.level][0].length) % fields[eraser.level][0].length

    let eWidth = diameter * (Math.random() + 0.5) * 4 * eraserSize;
    let eHeight = diameter * (Math.random() + 0.5) * 4 * eraserSize;
    if (eWidth + eraser.x > width) {
      eWidth = width - eraser.x;
    }
    rect(eraser.x, eraser.y, eWidth, eHeight);
    if (eraserTimer > eraserMax) {
      eraserTimer = 0;
      eraser.level++;
    }
  } else {
    if (Math.random() > 0.99) {
      eraserTimer = 1;
      const xOrYRando = Math.random()
      eraser.x = xOrYRando > 0.5 ? 0 : getRandomInts(0, width)
      eraser.y = xOrYRando <= 0.5 ? 0 : getRandomInts(0, height)
    }
  }
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

function addNewField() {
  const field = [];

  const direction = getRandomInts(0, 360)

  for (let x = 0; x < width; x++) {
    field.push([]);
    for (let y = 0; y < height; y++) {
      field[x].push({
        x,
        y,
        angle: noise(x * noiseScale, y * noiseScale, 0) * direction,
      })
    }
  }

  fields.push(field);
}

function setUpSpeedField() {
  const direction = getRandomInts(0, 360)
  let total = 0;

  for (let x = 0; x < width; x++) {
    speedField.push([]);
    for (let y = 0; y < height; y++) {
      const s = noise(x * speedNoiseScale, y * speedNoiseScale, 0) * direction * 0.1;
      speedField[x].push({
        x,
        y,
        speed: s,
      })
      total += s;
    }
  }
  const averageSpeed = total / (width * height);
  console.log(averageSpeed);
  maxSpeed /= averageSpeed;
}

function makeCircles() {
  circles = [
    {
      x: getRandomInts(0, width),
      y: getRandomInts(0, height),
      color: [255, 0, 0],
      speedMultiplier: Math.random() * maxSpeed,
    },
    {
      x: getRandomInts(0, width),
      y: getRandomInts(0, height),
      color: [255, 128, 0],
      speedMultiplier: Math.random() * maxSpeed,
    },
    {
      x: getRandomInts(0, width),
      y: getRandomInts(0, height),
      color: [255, 255, 0],
      speedMultiplier: Math.random() * maxSpeed,
    },
    {
      x: getRandomInts(0, width),
      y: getRandomInts(0, height),
      color: [128, 255, 0],
      speedMultiplier: Math.random() * maxSpeed,
    },
    {
      x: getRandomInts(0, width),
      y: getRandomInts(0, height),
      color: [0, 255, 0],
      speedMultiplier: Math.random() * maxSpeed,
    },
    {
      x: getRandomInts(0, width),
      y: getRandomInts(0, height),
      color: [0, 255, 128],
      speedMultiplier: Math.random() * maxSpeed,
    },
    {
      x: getRandomInts(0, width),
      y: getRandomInts(0, height),
      color: [0, 255, 255],
      speedMultiplier: Math.random() * maxSpeed,
    },
    {
      x: getRandomInts(0, width),
      y: getRandomInts(0, height),
      color: [0, 128, 255],
      speedMultiplier: Math.random() * maxSpeed,
    },
    {
      x: getRandomInts(0, width),
      y: getRandomInts(0, height),
      color: [0, 0, 255],
      speedMultiplier: Math.random() * maxSpeed,
    },
    {
      x: getRandomInts(0, width),
      y: getRandomInts(0, height),
      color: [128, 0, 255],
      speedMultiplier: Math.random() * maxSpeed,
    },
    {
      x: getRandomInts(0, width),
      y: getRandomInts(0, height),
      color: [255, 0, 255],
      speedMultiplier: Math.random() * maxSpeed,
    },
    {
      x: getRandomInts(0, width),
      y: getRandomInts(0, height),
      color: [255, 0, 128],
      speedMultiplier: Math.random() * maxSpeed,
    },
  ]
  circles.forEach((circ) => {
    circ.level = 0;
  })
  allCircles = structuredClone(circles);
}

function setUpControls() {
  textSize(10)
  fill(0,0,0)
  
  const button = createButton('Toggle eraser');
  button.position(width + 10, 15);
  button.size(80);
  button.mouseClicked(() => isEraserOn = !isEraserOn);

  text('How many', width + 10, 75)
  snakeSlider = createSlider(1, circles.length, 1);
  snakeSlider.position(width + 10, 75);
  snakeSlider.size(80);

  text('How fast', width + 10, 115)
  globalSpeedSlider = createSlider(0.05, 15, 1, 0.05);
  globalSpeedSlider.position(width + 10, 115);
  globalSpeedSlider.size(80);  

  const clearButton = createButton('Clear');
  clearButton.position(width + 10, 700);
  clearButton.size(80);
  clearButton.mouseClicked(() => {fill(0,0,0); rect(0,0,width,height)});

  text('How much teleport', width + 10, 155)
  teleportSlider = createSlider(0, 0.01, 0.001, 0.001);
  teleportSlider.position(width + 10, 155);
  teleportSlider.size(80);  
  
  text('Eraser Size', width + 10, 195)
  eraserSizeSlider = createSlider(0.1, 1, 0.5, 0.1);
  eraserSizeSlider.position(width + 10, 195);
  eraserSizeSlider.size(80);  
  
  text('Opacity', width + 10, 235)
  transparencyMultiplierSlider = createSlider(0.1, 1, 0.5, 0.1);
  transparencyMultiplierSlider.position(width + 10, 235);
  transparencyMultiplierSlider.size(80);  
}