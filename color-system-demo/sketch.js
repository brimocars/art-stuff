const width = 800;
const height = 800;
const numberOfCircles = 50;
const circleDiameter = 50;

const perlinValues = [
  { r: 150, g: 225, b: 300 },
  { r: 300, g: 225, b: 150 },
  { r: 350, g: 210, b: 220 },
  { r: 250, g: 250, b: 250 },
]

const selectedPalettes = [0, 2];

const perlinOffsets = {
  rX: 0, rY: 0, divR: 1,
  gX: 0, gY: 0, divR: 1,
  bX: 0, bY: 0, divR: 1,
}

function perlinColor(x, y, palette) {
  const values = perlinValues[palette];

  return color(
    noise((x + perlinOffsets.rX) / perlinOffsets.divR,
      (y + perlinOffsets.rY) / perlinOffsets.divR) * values.r,
    noise((x + perlinOffsets.gX) / perlinOffsets.divG,
      (y + perlinOffsets.gY) / perlinOffsets.divG) * values.g,
    noise((x + perlinOffsets.bX) / perlinOffsets.divB,
      (y + perlinOffsets.bY) / perlinOffsets.divB) * values.b,
  )
}

let circles = [];

function setup() {
  createCanvas(width, height);
  noStroke();
  angleMode(DEGREES);

  for (let i = 0; i < numberOfCircles; i++) {
    const x = randomGaussian(width/2, width/8);
    const y = randomGaussian(height/2, height/8);
    const pal = selectedPalettes[getRandomInts(0, selectedPalettes.length)];
    circles.push({
      x,
      y,
      col: perlinColor(x, y, pal),
    });
  }
}

function draw() {
  background(0);
  circles.forEach((c) => {
    fill(c.col);
    circle(c.x, c.y, circleDiameter)
  })
}

// const width = 800;
// const height = 800;
// const timeDivisor = 1000;

// const rectSize = 20

// const hslVals = {
//   h: { base: 180, variance: 5 },
//   s: { base: 75, variance: 5 },
//   l: { base: 75, variance: 10 },
//   compCount: 2,
//   compRange: 360
// };

// const palette = []


// function setup() {
//   createCanvas(width, height);
//   // noLoop();
//   noStroke();
//   colorMode(HSL);

//   for (let i = 0; i < hslVals.compCount; i++) {
//     palette.push({
//       h: (((hslVals.h.base + getRandomInts(-hslVals.h.variance, hslVals.h.variance) + Math.floor((hslVals.compRange / hslVals.compCount)) * i)) + 360) % 360,
//       s: (hslVals.s.base + getRandomInts(-hslVals.s.variance, hslVals.s.variance)),
//       l: (hslVals.l.base + getRandomInts(-hslVals.l.variance, hslVals.l.variance)),

//     })
//   }
//   console.log(palette)

//   for (let x = 0; x < width + rectSize; x += rectSize) {
//     for (let y = 0; y < height + rectSize; y += rectSize) {
//       const color = colorLerp(palette[0], palette[1], (x*y)/(width*height))
//       fill(color.h % 360, color.s, color.l);
//       rect(x, y, rectSize, rectSize);
//     }
//   }
// }

// function draw() {
//   let timeElapsed = ((millis() % timeDivisor) / timeDivisor);

//   for (let x = 0; x < width + rectSize; x += rectSize) {
//     for (let y = 0; y < height + rectSize; y += rectSize) {
//       const color = colorLerp(palette[0], palette[1], timeElapsed * (x*y)/(width*height))
//       fill(color.h, color.s, color.l);
//       rect(x, y, rectSize, rectSize);
//     }
//   }
// }

// function colorLerp(color1, color2, percent) {
//   if (color1.h - color2.h > 180) {
//     color2.h += 360;
//   }

//   return {
//     h: lerp(color1.h, color2.h, percent),
//     s: lerp(color1.s, color2.s, percent),
//     l: lerp(color1.l, color2.l, percent),
//   }
// }

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