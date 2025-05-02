const width = window.innerWidth
const height = window.innerHeight
let state = 0;
let isFirstFrameOnNewState = true;
let playerSize = 50;
let qrCode;
let connectedPlayerInterval = null;
let startCountDown = 3;
isFirstFrameOfGame = true;
let canvas;
let winningColor;

let connectedPlayers = {};
const playersWithInput = new Set();

// from austin
// https://github.com/AustinWilloughby/socket-input-transporter/blob/main/hosted/sketch.js
const socket = io();
const controllerState = {};
socket.on('inputFromController', msg => {
  const breakdown = msg.split('|');
  const player = breakdown[0];
  const rotation = breakdown[1];
  const upDown = breakdown[2];
  const leftRight = breakdown[3];
  if (state === 0) {
    playersWithInput.add(player);
  } else if (state === 1) {
    connectedPlayers[player].currentRotation = rotation;
    connectedPlayers[player].currentLeftRight = leftRight;
    connectedPlayers[player].currentUpDown = upDown;
  }
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
  canvas = createCanvas(width, height);
  angleMode(DEGREES);
  noStroke();
}

function draw() {
  switch (state) {
    case 0:
      background(255, 255, 255);
      if (isFirstFrameOnNewState) {
        isFirstFrameOnNewState = false;
        fill(255, 255, 255);
        connectedPlayerInterval = setInterval(() => {
          connectedPlayers = {};
          playersWithInput.forEach((player) => {
            connectedPlayers[player] = {};
          })
          playersWithInput.clear();
        }, 5000);
      }
      if (qrCode) {
        image(qrCode, 10, 10, width / 8, width / 8);
      }

      stroke(15, 15, 15);
      
      let i = 0;
      strokeWeight(2);
      Object.keys(connectedPlayers).forEach((player) => {
        push();
        fill(`#${player}`);
        translate(player.x + playerSize / 2, player.y + playerSize / 2);
        rotate(connectedPlayers[player].currentRotation);
        square(width / 4 + i * 2 * playerSize, height * 5 / 6, playerSize);
        i++;
        pop();
      })
      
      strokeWeight(8);
      textSize(100);
      text('Tilt!', width / 2 - 40, height / 2 - 80);
      
      textSize(50);
      text('Tilt your phone to fill the most screen', width / 2 - 375, height / 2 + 80);
      text("Press space to start", width / 2 - 200, height / 2 + 200);
      break;
    case 1:
      if (isFirstFrameOnNewState) {
        isFirstFrameOnNewState = false;
        clearInterval(connectedPlayerInterval);
        connectedPlayerInterval = null;

        Object.entries(connectedPlayers).forEach(([key, value]) => {
          value.currentLeftRight = 0;
          value.currentUpDown = 0;
          value.x = getRandomInts(playerSize, width - (2 * playerSize));
          value.y = getRandomInts(playerSize, height - (2 * playerSize));
        })
      }

      if (startCountDown > 0) {
        background(255, 255, 255);
        drawPlayers();
        fill(15, 15, 15);
        textSize(100);
        const countdownText = Math.ceil(startCountDown);
        text(countdownText, width / 2 - 50, height / 2);
        startCountDown -= deltaTime / 1000;
      } else if (startCountDown > -1) {
        background(255, 255, 255);
        drawPlayers();
        fill(15, 15, 15);
        textSize(100);
        text('Go!', width / 2 - 50, height / 2);
        startCountDown -= deltaTime / 1000;
      } else {
        if (isFirstFrameOfGame) {
          isFirstFrameOfGame = false;
          background(255, 255, 255);
        }
        Object.entries(connectedPlayers).forEach(([key, value]) => {
          let leftRight = parseFloat(value.currentLeftRight);
          leftRight = Math.max(-30, Math.min(30, leftRight));
          if (Math.abs(leftRight) < 2) {
            leftRight = 0;
          }
          let upDown = parseFloat(value.currentUpDown);
          upDown = Math.max(-30, Math.min(30, upDown));
          if (Math.abs(upDown) < 2) {
            upDown = 0;
          }

          console.log(leftRight, upDown);
          value.x += leftRight / 2;
          value.y += upDown / 2;
          console.log(`player: ${JSON.stringify(value)}`);
        })
        Object.entries(connectedPlayers).forEach(([key, value]) => {
          Object.entries(connectedPlayers).forEach(([key2, value2]) => {
            if (key !== key2) {
              resolveCollision(value, value2);
            }
          })
          
          if (value.x < 0) {
            value.x = 0;
          } else if (value.x > width - playerSize) {
            value.x = width - playerSize;
          }

          if (value.y < 0) {
            value.y = 0;
          } else if (value.y > height - playerSize) {
            value.y = height - playerSize;
          }
        })
      
        drawPlayers();
      }

      break;
    case 2:
      if (isFirstFrameOnNewState) {
        isFirstFrameOnNewState = false;
        getWinningColor().then((color) => {
          winningColor = color;
        })
      }
      background(255, 255, 255);
      if (winningColor) {
        stroke(15, 15, 15);
        fill(15, 15, 15);
        textSize(100);
        text('Winner!', width / 2 - 150, height / 2 - 80);
        textSize(50);
        text("Press space to reset", width / 2 - 200, height / 2 + 200);
        noStroke();
        fill(...winningColor);
        square(width / 2 - playerSize / 2, height / 2, playerSize);      
      }
      break;
  }
}

function drawPlayers() {
  stroke(0, 0, 0);
  strokeWeight(0);
  Object.entries(connectedPlayers).forEach(([key, value]) => {
    push(); 
    fill(`#${key}`);
    translate(value.x + playerSize / 2, value.y + playerSize / 2);
    rotate(connectedPlayers[player].currentRotation);
    square(value.x, value.y, playerSize);
    pop();
  })
}

// ChatGPT way of not letting players go through each other
function resolveCollision(a, b) {
  let dx = (a.x + playerSize / 2) - (b.x + playerSize / 2);
  let dy = (a.y + playerSize / 2) - (b.y + playerSize / 2);
  let overlapX = playerSize / 2 + playerSize / 2 - Math.abs(dx);
  let overlapY = playerSize / 2 + playerSize / 2 - Math.abs(dy);

  if (overlapX > 0 && overlapY > 0) {
    // Resolve in the axis of least penetration
    if (overlapX < overlapY) {
      let push = dx < 0 ? -overlapX : overlapX;
      if (!a.dragging) a.x += push / 2;
      if (!b.dragging) b.x -= push / 2;
    } else {
      let push = dy < 0 ? -overlapY : overlapY;
      if (!a.dragging) a.y += push / 2;
      if (!b.dragging) b.y -= push / 2;
    }
  }
}

function getWinningColor() {
  return new Promise((resolve, reject) => {
    const imageSrc = canvas.elt.toDataURL('image/png');
    const imageElement = new Image();
    imageElement.src = imageSrc;
    imageElement.onload = () => {
      try {
        const colorThief = new ColorThief();
        const winningColor = colorThief.getColor(imageElement);
        resolve(winningColor)
      } catch (err) {
        console.error('Error getting winning color:', err);
        reject(err);
      }
    }
  })
}

function keyPressed() {
  if (keyCode === 32) {
    state++;
    isFirstFrameOnNewState = true;
    if (state > 2) {
      state = 0;
    }
  }
}

function loadImageAsync(image) {
  return new Promise((resolve, reject) => {
    loadImage(image, (img) => resolve(img), (err) => reject(err));
  });
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
