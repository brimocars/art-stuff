const width = 800;
const height = 800;
const fieldSpacing = 15;
const lineLength = 10;
const fields = [];
const diameter = 30
const maxSpeed = 5;
const eraserMax = 300;
let eraserTimer = 0;

const circles = [
  {
    x: getRandomInts(0, width),
    y: getRandomInts(0, height),
    color: [255,0,0],
    speedMultiplier: Math.random() * maxSpeed,
  },
  {
    x: getRandomInts(0, width),
    y: getRandomInts(0, height),
    color: [255,128,0],
    speedMultiplier: Math.random() * maxSpeed,
  },
  {
    x: getRandomInts(0, width),
    y: getRandomInts(0, height),
    color: [255,255,0],
    speedMultiplier: Math.random() * maxSpeed,
  },
  {
    x: getRandomInts(0, width),
    y: getRandomInts(0, height),
    color: [128,255,0],
    speedMultiplier: Math.random() * maxSpeed,
  },
  {
    x: getRandomInts(0, width),
    y: getRandomInts(0, height),
    color: [0,255,0],
    speedMultiplier: Math.random() * maxSpeed,
  },
  {
    x: getRandomInts(0, width),
    y: getRandomInts(0, height),
    color: [0,255,128],
    speedMultiplier: Math.random() * maxSpeed,
  },
  {
    x: getRandomInts(0, width),
    y: getRandomInts(0, height),
    color: [0,255,255],
    speedMultiplier: Math.random() * maxSpeed,
  },
  {
    x: getRandomInts(0, width),
    y: getRandomInts(0, height),
    color: [0,128,255],
    speedMultiplier: Math.random() * maxSpeed,
  },
  {
    x: getRandomInts(0, width),
    y: getRandomInts(0, height),
    color: [0,0,255],
    speedMultiplier: Math.random() * maxSpeed,
  },
  {
    x: getRandomInts(0, width),
    y: getRandomInts(0, height),
    color: [128,0,255],
    speedMultiplier: Math.random() * maxSpeed,
  },
  {
    x: getRandomInts(0, width),
    y: getRandomInts(0, height),
    color: [255,0,255],
    speedMultiplier: Math.random() * maxSpeed,
  },
  {
    x: getRandomInts(0, width),
    y: getRandomInts(0, height),
    color: [255,0,128],
    speedMultiplier: Math.random() * maxSpeed,
  },
]

const eraser = {
  x: 0,
  y: getRandomInts(0, height),
  color: [0,0,0],
  speedMultiplier: Math.random() * maxSpeed,
}

const noiseSpeedDivisor = 5;
const noiseScale = 0.05;

function setup() {
  createCanvas(width, height);
  background(0);
  angleMode(DEGREES)
  // blendMode(ADD);
  
  addNewField();

  noStroke();
  circles.forEach((circ) => {
    circ.level = 0
  })
}

function draw() {
  circles.forEach((circ) => {
    fill(circ.color[0], circ.color[1], circ.color[2], 5 * circ.speedMultiplier);

    
    const teleportNumber = Math.random();
    const smallTeleport = teleportNumber > 0.990
    const bigTeleport = teleportNumber > 0.999
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
      circ.x += cos(angle) * circ.speedMultiplier + addedX;
      circ.y += sin(angle) * circ.speedMultiplier + addedY;
      circ.x = (circ.x + fields[circ.level].length) % fields[circ.level].length
      circ.y = (circ.y + fields[circ.level][0].length) % fields[circ.level][0].length  
    }
    circle(circ.x, circ.y, diameter);
  })

  // if (eraserTimer !== 0) {
  //   fill(0,0,0);
  //   eraserTimer += 1;
  //   circle(eraser.x, eraser.y, diameter * 3);
  //   if (eraser > eraserMax) {
  //     eraserTimer = 0;
  //   }
  // } else {
  //   const randoms = 
  // }
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