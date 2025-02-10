let width = window.innerWidth;
let height = window.innerHeight;
let areSlidersBelow;
if (width >= height) {
  areSlidersBelow = false;
  width = width - 200;
} else {
  areSlidersBelow = true;
  height = height - 200;
}
const nodeSize = 50;
const nodes = [];

let nodeMode = true;

let childRepulsionRangeSlider;
let childRepulsionRange;
let childRepulsionForceSlider;
let childRepulsionForce;
let pushFromParentForceSlider;
let pushFromParentForce;
let pullFromParentForceSlider;
let pullFromParentForce;
let wiggleChanceSlider;
let wiggleChance;
let childDistanceMultiplierSlider;
let childDistanceMultiplier;
let childColorRangeSlider;
let childColorRange;
let childGenerationChanceSlider;
let childGenerationChance;
let childSizeSlider;
let childSize;
let maxChildsSlider;
let maxChilds;


function setup() {
  if (areSlidersBelow) {
    createCanvas(width, height + 1000);
  } else {
    createCanvas(width + 200, height);
  }
  setUpSliders();
  nodes.push(new Node(width / 2, height / 2));
}

function draw() {
  childRepulsionRange = childRepulsionRangeSlider.value();
  childRepulsionForce = childRepulsionForceSlider.value();
  pushFromParentForce = pushFromParentForceSlider.value();
  pullFromParentForce = pullFromParentForceSlider.value();
  wiggleChance = wiggleChanceSlider.value();
  childDistanceMultiplier = childDistanceMultiplierSlider.value();
  childColorRange = childColorRangeSlider.value();
  childGenerationChance = childGenerationChanceSlider.value();
  childSize = childSizeSlider.value();
  maxChilds = maxChildsSlider.value();

  nodes.forEach((node) => {
    node.update();
  })

  fill(0, 0, 0);
  rect(0, 0, width, height);
  nodes.forEach((node) => {
    node.draw();
  })
}

class Node {
  constructor(x, y, col) {
    this.x = x;
    this.y = y;
    this.color = col ?? color(...getRandomInts(0, 255, 3));
    this.childNodes = [];
  }

  update() {
    if (this.childNodes.length < maxChilds) {
      this.maybeMakeNewNode();
    }

    this.childNodes.forEach((child, i) => {
      if (Math.random() < wiggleChance) { 
        child.x += Math.round(Math.random()) - 0.5;
        child.y += Math.round(Math.random()) - 0.5;
      }

      this.childNodes.forEach((otherChild, j) => {
        if (i !== j) { 
          const xDif = otherChild.x - child.x;
          const yDif = otherChild.y - child.y;
          if (Math.pow(xDif, 2) + Math.pow(yDif, 2) <= childRepulsionRange * childRepulsionRange) {
            child.x -= (xDif / (Math.abs(xDif) + Math.abs(yDif))) * childRepulsionForce;
            child.y -= (yDif / (Math.abs(xDif) + Math.abs(yDif))) * childRepulsionForce;
            otherChild.x += (xDif / (Math.abs(xDif) + Math.abs(yDif))) * childRepulsionForce;
            otherChild.y += (yDif / (Math.abs(xDif) + Math.abs(yDif))) * childRepulsionForce;
          }
        }
      })

      child.x = lerp(child.x, this.x, 0.001 * pullFromParentForce);
      child.y = lerp(child.y, this.y, 0.001 * pullFromParentForce);

      const xToParent = this.x - child.x;
      const yToParent = this.y - child.y;
      if (Math.pow(xToParent, 2) + Math.pow(yToParent, 2) < Math.pow((nodeSize + childSize) / 2, 2)) {
        child.x -= (xToParent / (Math.abs(xToParent) + Math.abs(yToParent))) * pushFromParentForce;
        child.y -= (yToParent / (Math.abs(xToParent) + Math.abs(yToParent))) * pushFromParentForce;
      }
    })

  }

  draw() {
    if (nodeMode) {
      fill(this.color);
      circle(this.x, this.y, nodeSize);
      this.childNodes.forEach((child) => {
        child.draw();
      })
    }
  }

  maybeMakeNewNode() {
    if (Math.random() < childGenerationChance / ((this.childNodes.length / maxChilds) + 0)) {
      const newChild = new ChildNode(this.x + getRandomInts(-nodeSize * childDistanceMultiplier, nodeSize * childDistanceMultiplier), this.y + getRandomInts(-nodeSize * childDistanceMultiplier, nodeSize * childDistanceMultiplier), this.color);
      this.childNodes.push(newChild);
    }
  }
}

class ChildNode {
  constructor(x, y, parentColor) {
    this.x = x;
    this.y = y;
    this.color = color(parentColor._getRed() + getRandomInts(-childColorRange, childColorRange), parentColor._getGreen() + getRandomInts(-childColorRange, childColorRange), parentColor._getBlue() + getRandomInts(-childColorRange, childColorRange));
  }

  update() {

  }

  draw() {
    if (nodeMode && this.x + childSize/2 <= width) {
      fill(this.color);
      circle(this.x, this.y, childSize);
    }
  }
}

function setUpSliders() {
  textSize(10);
  fill(255,255,255);
  if (areSlidersBelow) {
    // rect(width, 0, 200, height);
    // fill(0,0,0);
    
    // const button = createButton('Toggle mode');
    // button.position(width + 10, 15);
    // button.size(180);
    // button.mouseClicked(() => nodeMode = !nodeMode);
  
    // text('Child repulsion range', width + 10, 75)
    // childRepulsionRangeSlider = createSlider(1, 50, 10, 1);
    // childRepulsionRangeSlider.position(width + 10, 75);
    // childRepulsionRangeSlider.size(180);
  
    // text('Child repulsion force', width + 10, 125)
    // childRepulsionForceSlider = createSlider(1, 10, 3, 1);
    // childRepulsionForceSlider.position(width + 10, 125);
    // childRepulsionForceSlider.size(180);
  
    // text('Push from parent force', width + 10, 175)
    // pushFromParentForceSlider = createSlider(1, 20, 10, 1);
    // pushFromParentForceSlider.position(width + 10, 175);
    // pushFromParentForceSlider.size(180);
  
    // text('Pull from parent force', width + 10, 225)
    // pullFromParentForceSlider = createSlider(0, 10, 0.5, 0.5);
    // pullFromParentForceSlider.position(width + 10, 225);
    // pullFromParentForceSlider.size(180);
  
    // text('Chance to wiggle', width + 10, 275)
    // wiggleChanceSlider = createSlider(0, 1, 0.5, 0.01);
    // wiggleChanceSlider.position(width + 10, 275);
    // wiggleChanceSlider.size(180);
  
    // text('Child spawning distance multiplier', width + 10, 325)
    // childDistanceMultiplierSlider = createSlider(0, 3, 0.5, 0.1);
    // childDistanceMultiplierSlider.position(width + 10, 325);
    // childDistanceMultiplierSlider.size(180);
  
    // text('Child color range', width + 10, 375)
    // childColorRangeSlider = createSlider(0, 50, 10, 1);
    // childColorRangeSlider.position(width + 10, 375);
    // childColorRangeSlider.size(180);
    
    // text('Child generation chance', width + 10, 425)
    // childGenerationChanceSlider = createSlider(0, 0.5, 0.01, 0.001);
    // childGenerationChanceSlider.position(width + 10, 425);
    // childGenerationChanceSlider.size(180);
  
    // text('Child Size', width + 10, 475)
    // childSizeSlider = createSlider(1, 40, 10, 1);
    // childSizeSlider.position(width + 10, 475);
    // childSizeSlider.size(180);
      
    // text('Max childs (does not delete)', width + 10, 525)
    // maxChildsSlider = createSlider(10, 1000000, 10, 10);
    // maxChildsSlider.position(width + 10, 525);
    // maxChildsSlider.size(180);
  } else {
    rect(width, 0, 200, height);
    fill(0,0,0);
    
    const button = createButton('Toggle mode');
    button.position(width + 10, 15);
    button.size(180);
    button.mouseClicked(() => nodeMode = !nodeMode);
  
    text('Child repulsion range', width + 10, 75)
    childRepulsionRangeSlider = createSlider(1, 50, 10, 1);
    childRepulsionRangeSlider.position(width + 10, 75);
    childRepulsionRangeSlider.size(180);
  
    text('Child repulsion force', width + 10, 125)
    childRepulsionForceSlider = createSlider(1, 10, 3, 1);
    childRepulsionForceSlider.position(width + 10, 125);
    childRepulsionForceSlider.size(180);
  
    text('Push from parent force', width + 10, 175)
    pushFromParentForceSlider = createSlider(1, 20, 10, 1);
    pushFromParentForceSlider.position(width + 10, 175);
    pushFromParentForceSlider.size(180);
  
    text('Pull from parent force', width + 10, 225)
    pullFromParentForceSlider = createSlider(0, 10, 0.5, 0.5);
    pullFromParentForceSlider.position(width + 10, 225);
    pullFromParentForceSlider.size(180);
  
    text('Chance to wiggle', width + 10, 275)
    wiggleChanceSlider = createSlider(0, 1, 0.5, 0.01);
    wiggleChanceSlider.position(width + 10, 275);
    wiggleChanceSlider.size(180);
  
    text('Child spawning distance multiplier', width + 10, 325)
    childDistanceMultiplierSlider = createSlider(0, 3, 0.5, 0.1);
    childDistanceMultiplierSlider.position(width + 10, 325);
    childDistanceMultiplierSlider.size(180);
  
    text('Child color range', width + 10, 375)
    childColorRangeSlider = createSlider(0, 50, 10, 1);
    childColorRangeSlider.position(width + 10, 375);
    childColorRangeSlider.size(180);
    
    text('Child generation chance', width + 10, 425)
    childGenerationChanceSlider = createSlider(0, 0.5, 0.01, 0.001);
    childGenerationChanceSlider.position(width + 10, 425);
    childGenerationChanceSlider.size(180);
  
    text('Child Size', width + 10, 475)
    childSizeSlider = createSlider(1, 40, 10, 1);
    childSizeSlider.position(width + 10, 475);
    childSizeSlider.size(180);
      
    text('Max childs (does not delete)', width + 10, 525)
    maxChildsSlider = createSlider(10, 1000000, 10, 10);
    maxChildsSlider.position(width + 10, 525);
    maxChildsSlider.size(180);
  }
}

/**
 * rules:
 * 1. There are Nodes and ChildNodes. Each Node will maybe produce a new ChildNode each frame
 * 2. Nodes don't move. ChildNodes are weakly pulled towards their parent node, but pushed strongly away from other child nodes of the same parent
 * 3. Connect the nodes with drawShape?
 */

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
