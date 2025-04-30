const width = window.innerWidth
const height = window.innerHeight
let state = 0;
let playerSize = 50;
let qrCode;

// from austin
// https://github.com/AustinWilloughby/socket-input-transporter/blob/main/hosted/sketch.js
const socket = io();
const controllerState = {};
socket.on('inputFromController', msg => {
  console.log(msg)
  const breakdown = msg.split('-');
});

async function preload() {
  const url = '/qrCode';
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  })
  const imageData = await res.text(); // Get the base64 string
  qrCode = await loadImageAsync(imageData);
}

function setup() {
  frameRate(60);
  createCanvas(width, height);
  angleMode(DEGREES);
  noStroke();
}

function draw() {
  background(255, 255, 255);
  switch (state) {
    case 0:
      image(qrCode, 10, 10, width / 8, width / 8);

      stroke(15, 15, 15);
      // textSize(50);

      // text('Press space to start', width / 2 - 300, height / 2 - 80);
      // text('Your goal is to disappear - ', width / 2 - 300, height / 2 + 80);
      // text('Make Austin feel disillusionment.', width / 2 - 400, height / 2 + 200);
      break;
    case 1:
      break;
    case 2:
      // stroke(15, 15, 15);
      // fill(15, 15, 15);
      // textSize(50);
      // text(win ? "You won!" : 'Game Over', width / 2 - 200, height / 2 - 80);
      // text("Press space to reset", width / 2 - 200, height / 2 + 80);
      break;
  }
}

function keyPressed() {
  if (keyCode === 32) {

  }
}

function loadImageAsync(image) {
  return new Promise((resolve, reject) => {
    loadImage(image, (img) => resolve(img), (err) => reject(err));
  });
}

//TODO: Remove?
// function weirdModThing(numberToMod, total) {
//   return (numberToMod + total) % total;
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
