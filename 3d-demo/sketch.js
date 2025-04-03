const width = window.innerWidth - 200;
const height = window.innerHeight;

let shaderProgram;
let vertexShader;
let fragShader;
let teapot;

function preload() {
  vertexShader = loadStrings('shader.vert');
  fragShader = loadStrings('shader.frag');
  teapot = loadModel('teapot.stl');
}

function setup() {
  angleMode(degrees);
  pixelDensity(1);
  createCanvas(width + 200, height, WEBGL);
  // shaderProgram = createShader(vertexShader.join('\n'), fragShader.join('\n'));
}

function draw() {
  background(255);
  // translate(-width/2, -height/2); //Preserve coordinate structure from 2D

  //directionalLight(255, 0, 255, Math.abs(sin(millis() / 300)), Math.abs(cos(millis() / 200)), 0);
  //directionalLight(255, 0, 255, 0, 180, 0)
  pointLight(mouseX / width * 255, mouseY / width * 255, 255, mouseX - (width / 2), mouseY - (height / 2), 1000);

 // camera(sin(millis() / 500) * 80, cos(millis() / 500) * 80, 0, 0, 0, 0, 0, 1, 0);


  // for (let i = 0; i < 10; i++) {
  //   push();
  //   translate(sin(i * millis()/100) * width / 10);
  //   sphere(100);
  //   pop();
  // }


  fill(255, 255, 255);
  push();
  translate(-200, 0, 0);
  scale(1, 5, 3);
  sphere(50);
  pop();

  push();
  rotate(millis()/1000, [1, 1, 1]);
  translate(200, 0, 0);
  scale(sin(millis()/1000) + 1, cos(millis()/1000) + 1, sin(millis()/1000 * 2) + 1);
  scale(50);
  // box(100, 100, 100);
  model(teapot);

  pop();

  sphere(20);

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
