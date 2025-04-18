const width = window.innerWidth
const height = window.innerHeight
let state = 0;
const defaultPlayer = {
  x: width / 2,
  y: width / 2,
  speed: 1,
};
let player;
let face;
let aPose;
let playerSize = 50;
let powerupSize = 30;
let timer = 0;

let austins = [];
let powerups = [];

// from austin
// https://github.com/AustinWilloughby/socket-input-transporter/blob/main/hosted/sketch.js
const socket = io();
const controllerState = {};
socket.on('inputFromController', msg => {
  const breakdown = msg.split('-');

  if (breakdown[1] === 'down') {
    controllerState[breakdown[0]] = true;
  }
  else if (breakdown[1] === 'up') {
    controllerState[breakdown[0]] = false;
  }
});

function preload() {
  face = loadImage('willoughby_highres_2024.jpg');
  aPose = loadImage('austin-a-pose.png');
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
      stroke(15, 15, 15);
      textSize(50);
      text("Press space to start", width / 2 - 200, height / 2);
      break;
    case 1:
      handlePlayer();
      handleAustins();
      timer++;
      break;
    case 2:
      stroke(15, 15, 15);
      textSize(50);
      text("Game over", width / 2 - 200, height / 2 - 80);
      text("Press space to reset", width / 2 - 200, height / 2 + 80);
  }
}

function handlePlayer() {
  if (controllerState.up) {
    player.y -= player.speed;
  }
  if (controllerState.down) {
    player.y += player.speed;
  }
  if (controllerState.left) {
    player.x -= player.speed;
  }
  if (controllerState.right) {
    player.x += player.speed;
  }
  player.x = weirdModThing(player.x, width);
  player.y = weirdModThing(player.y, height);

  const newPowerups = [];

  powerups.forEach((powerup) => {
    if (intersects(player, powerup, playerSize, powerupSize)) {
      if (powerup.type === 'speed') {
        player.speed++;
      } else if (powerup.type === 'size') {
        playerSize--;
      }
    } else {
      newPowerups.push(powerup);
    }
    powerups = newPowerups;
  });

  fill(0, 0, 0);
  square(player.x, player.y, playerSize);
}

function intersects(a, b, aSize, bSize) {
  return a.x < b.x + bSize &&
    a.x + aSize > b.x &&
    a.y < b.y + bSize &&
    a.y + aSize > b.y;
}

function handleAustins() {
  austins.forEach((austin) => {
    austin.move();
    austin.draw();
  })
};

class Austin {
  constructor(x, y, speed, img) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.img = img;
  }
  move() {
    if (this.img === aPose) {
      const angleToPlayer = Math.atan2(player.y - this.y, player.x - this.x);
      this.x -= Math.cos(angleToPlayer) * this.speed;
      this.y -= Math.sin(angleToPlayer) * this.speed;
      this.x = weirdModThing(this.x, width);
      this.y = weirdModThing(this.y, height);
    } else {
      //TODO: change this
      const angleToPlayer = Math.atan2(player.y - this.y, player.x - this.x);
      this.x -= Math.cos(angleToPlayer) * this.speed;
      this.y -= Math.sin(angleToPlayer) * this.speed;
      this.x = weirdModThing(this.x, width);
      this.y = weirdModThing(this.y, height);
    }
  }
  draw() {
    image(this.img, this.x, this.y, 50, 50);
  }
}

class Powerup {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
  }
  draw() {
    if (this.type === 'speed') {
      fill(255, 0, 0);
    } else if (this.type === 'size') {
      fill(0, 0, 255);
    }
    square(this.x, this.y, powerupSize);
  }
}


function keyPressed() {
  if (keyCode === 32) {
    state = (state + 1) % 3;
    if (state === 1) {
      timer = 0;
      player = structuredClone(defaultPlayer);
      austins = [];
      austins.push(new Austin(getRandomInts(0, width), getRandomInts(0, height), getRandomInts(-1, 1), Math.random() > 0.5 ? face : aPose));
      powerups = [];
      powerups.push(new Powerup(getRandomInts(0, width), getRandomInts(0, height), Math.random() > 0.5 ? 'speed' : 'size'));
      setInterval(() => {
        if (state === 1) {
          austins.push(new Austin(getRandomInts(0, width), getRandomInts(0, height), getRandomInts(-1, 1), Math.random() > 0.5 ? face : aPose));
          powerups.push(new Powerup(getRandomInts(0, width), getRandomInts(0, height), Math.random() > 0.5 ? 'speed' : 'size'));
        }
      }, 3000);
    }
  }
}

function weirdModThing(numberToMod, total) {
  return (numberToMod + total) % total;
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
