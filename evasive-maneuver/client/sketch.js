const width = window.innerWidth
const height = window.innerHeight
let state = 0;
const defaultPlayer = {
  x: width / 2,
  y: width / 2,
  speedX: 2,
  speedY: 2,
  maxSpeed: 2
};
let player;
let face;
let aPose;
let playerSize = 50;
let powerupSize = 30;
let austinSize = 50;
let timer = 1;
let win = false;

let austins = [];
let powerups = [];

// from austin
// https://github.com/AustinWilloughby/socket-input-transporter/blob/main/hosted/sketch.js
const socket = io();
const controllerState = {};
socket.on('inputFromController', msg => {
  const breakdown = msg.split('-');

  const currentState = controllerState[breakdown[0]];
  const direction = breakdown[0] === 'left' || breakdown[0] === 'right' ? 'speedX' : 'speedY';
  if (breakdown[1] === 'down') {
    controllerState[breakdown[0]] = true;
  }
  else if (breakdown[1] === 'up') {
    if (currentState) {
      player[direction] = 0;
    }
    controllerState[breakdown[0]] = false;
  }
});

function preload() {
  // also from austin, responsibly sourced and responsibly used
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

      text('Press space to start', width / 2 - 300, height / 2 - 80);
      text('Your goal is to disappear - ', width / 2 - 300, height / 2 + 80);
      text('Make Austin feel disillusionment.', width / 2 - 400, height / 2 + 200);
      break;
    case 1:
      handlePlayer();
      handleAustins();
      drawPowerups();
      addStuff();
      timer++;
      break;
    case 2:
      stroke(15, 15, 15);
      fill(15, 15, 15);
      textSize(50);
      text(win ? "You won!" : 'Game Over', width / 2 - 200, height / 2 - 80);
      text("Press space to reset", width / 2 - 200, height / 2 + 80);
  }
}

function handlePlayer() {
  if (controllerState.up) {
    player.speedY = Math.min(player.speedY + 0.4, player.maxSpeed);
    player.y -= player.speedY;
  }
  if (controllerState.down) {
    player.speedY = Math.min(player.speedY + 0.4, player.maxSpeed);
    player.y += player.speedY;
  }
  if (controllerState.left) {
    player.speedX = Math.min(player.speedX + 0.4, player.maxSpeed);
    player.x -= player.speedX;
  }
  if (controllerState.right) {
    player.speedX = Math.min(player.speedX + 0.4, player.maxSpeed);
    player.x += player.speedX;
  }
  player.x = weirdModThing(player.x, width);
  player.y = weirdModThing(player.y, height);

  const newPowerups = [];

  powerups.forEach((powerup) => {
    if (intersects(player, powerup, playerSize, powerupSize)) {
      if (powerup.type === 'speed') {
        player.maxSpeed++;
      } else if (powerup.type === 'size') {
        playerSize -= 3;
        austinSize -= 3;
        if (playerSize <= 5) {
          state = 2;
          win = true;
        } 
      }
    } else {
      newPowerups.push(powerup);
    }
    powerups = newPowerups;
  });

  austins.forEach((austin) => {
    if (intersects(player, austin, playerSize, austinSize)) {
      state = 2;
      win = false;
    }
  })

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
    if (img !== aPose) {
      this.randomTimerAdd = getRandomInts(0, 360);
    }
  }
  move() {
    if (this.img === aPose) {
      const angleToPlayer = Math.atan2(player.y - this.y, player.x - this.x);
      this.x += Math.cos(angleToPlayer) * this.speed;
      this.y += Math.sin(angleToPlayer) * this.speed;
      this.x = weirdModThing(this.x, width);
      this.y = weirdModThing(this.y, height);
    } else {
      const goalX = player.x + cos(timer + this.randomTimerAdd) * 500;
      const goalY = player.y + sin(timer + this.randomTimerAdd) * 500;
      const angleToPlayer = Math.atan2(goalY - this.y, goalX- this.x);
      this.x += Math.cos(angleToPlayer) * this.speed;
      this.y += Math.sin(angleToPlayer) * this.speed;
      this.x = weirdModThing(this.x, width);
      this.y = weirdModThing(this.y, height);
    }
  }
  draw() {
    image(this.img, this.x, this.y, austinSize, austinSize);
  }
}

function drawPowerups() {
  powerups.forEach((powerup) => {
    powerup.draw();
  });
}

class Powerup {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
  }
  draw() {
    push();
    fill(150, 150, 150);
    square(this.x, this.y, powerupSize);
    if (this.type === 'speed') {
      fill(255, 230, 50);
      translate(this.x, this.y);
      beginShape();
      vertex(20, 2);
      vertex(16, 12);
      vertex(25, 12)
      vertex(10, 28)
      vertex(14, 18);
      vertex(5, 18);
      vertex(20, 2);
      endShape();
    } else if (this.type === 'size') {
      fill(50, 135, 255);
      translate(this.x, this.y);
      rect(13, 1, 4, 5);
      triangle(10, 5, 20, 5, 15, 12)

      rect(13, 24, 4, 5);
      triangle(10, 25, 20, 25, 15, 18)

      rect(1, 13, 5, 4);
      triangle(5, 10, 5, 20, 12, 15);

      rect(24, 13, 5, 4);
      triangle(25, 10, 25, 20, 18, 15);
    }
    pop();
  }
}

function addStuff () {
  if (timer % 180 === 0) {
    austinSize += getRandomInts(3, 8);
    const playerSafeArea = {
      x: player.x - playerSize,
      y: player.y - playerSize,
    }
    let newAustin = new Austin(getRandomInts(0, width), getRandomInts(0, height), Math.max(Math.floor(timer/360), 1), Math.random() > 0.5 ? face : aPose);
    while (intersects(playerSafeArea, newAustin, playerSize * 3, austinSize)) {
      console.log('collision');
      newAustin = new Austin(getRandomInts(0, width), getRandomInts(0, height), Math.max(Math.floor(timer/360), 1), Math.random() > 0.5 ? face : aPose);
    }
    austins.push(newAustin);
    powerups.push(new Powerup(getRandomInts(0, width), getRandomInts(0, height), Math.random() > 0.5 ? 'speed' : 'size'));
  }

  if (timer > 800 && timer % 180 === 0) {
    austins.shift();
  }
}

function keyPressed() {
  if (keyCode === 32) {
    state = (state + 1) % 3;
    if (state === 1) {
      timer = 1;
      player = structuredClone(defaultPlayer);
      austins = [];

      const playerSafeArea = {
        x: player.x - playerSize,
        y: player.y - playerSize,
      }

      let newAustin = new Austin(getRandomInts(0, width), getRandomInts(0, height), 1, Math.random() > 0.5 ? face : aPose);
      while (intersects(playerSafeArea, newAustin, playerSize * 3, austinSize)) {
        console.log('collision');
        newAustin = new Austin(getRandomInts(0, width), getRandomInts(0, height), 1, Math.random() > 0.5 ? face : aPose);
      }

      austins.push(newAustin);
      powerups = [];
      powerups.push(new Powerup(getRandomInts(0, width), getRandomInts(0, height), Math.random() > 0.5 ? 'speed' : 'size'));
      powerups.push(new Powerup(getRandomInts(0, width), getRandomInts(0, height), Math.random() > 0.5 ? 'speed' : 'size'));
      powerups.push(new Powerup(getRandomInts(0, width), getRandomInts(0, height), 'speed'));
      powerups.push(new Powerup(getRandomInts(0, width), getRandomInts(0, height), 'size'));
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
