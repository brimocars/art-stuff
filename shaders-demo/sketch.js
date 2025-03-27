//The vertex and fragment shaders can be found in the shader.vert and shader.frag
//files. Press the > button up and left from this comment to access the files

const WINDOW_SKETCH = false;
const KEYBOARD_CONTROLS = false; //Always off if WINDOW_SKETCH is true

let shaderProgram;
let vertexShader;
let fragShader;
function preload() {
  vertexShader = loadStrings('shader.vert');
  fragShader = loadStrings('shader.frag');
}

function setup() {
  p5.disableFriendlyErrors = true;
  init();
}

const init = () => {
  let xSize = windowWidth;
  let ySize = windowHeight;
 
  if(WINDOW_SKETCH) {
    xSize = 390;
    ySize = 1215;
  }
  pixelDensity(1);
  createCanvas(xSize, ySize, WEBGL);
  shaderProgram = createShader(vertexShader.join('\n'), fragShader.join('\n'));
}

function draw() {
  background(0);
  translate(-width/2, -height/2); //Preserve coordinate structure from 2D
  shader(shaderProgram);
  shaderProgram.setUniform('time', millis() / 1000)
  shaderProgram.setUniform('resolution', [width, height]);

  rect(0, 0, width, height); 
  //circle(width/2, height/2, 100);
}

function mousePressed(e) {
  if(WINDOW_SKETCH) {return;}
  if(e.button !== 0) {return;} //If not left mouse button
 
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    const fs = fullscreen();
    fullscreen(!fs);
  }
}

function windowResized() {  
  if(WINDOW_SKETCH) {return;}
 
  init();
}

function keyPressed() {
  if(!KEYBOARD_CONTROLS || WINDOW_SKETCH) {return;}
 
  /*if(keyCode === 32) {
  }*/
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}