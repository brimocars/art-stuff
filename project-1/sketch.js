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

const nodeModes = new Map([
  [0, 'balls'],
  [1, 'trippyTriangles'],
  [2, 'path']
]);
let nodeMode = 0;


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
let frameRateSlider;
let percentOfNodesToHitBeforeStoppingSlider;
let percentOfNodesToHitBeforeStopping;

function setup() {
  noStroke();
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
  frameRate(frameRateSlider.value());
  percentOfNodesToHitBeforeStopping = percentOfNodesToHitBeforeStoppingSlider.value();

  nodes.forEach((node) => {
    node.update();
  })

  fill(0, 0, 0);
  rect(0, 0, width, height);
  nodes.forEach((node) => {
    node.draw();
  })
  fill(255, 255, 255);
  text(`${nodeModes.get(nodeMode % nodeModes.size)}`, 20, 40);

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
    switch (nodeModes.get(nodeMode % nodeModes.size)) {
      case 'balls':
        fill(this.color);
        circle(this.x, this.y, nodeSize);
        this.childNodes.forEach((child) => {
          child.draw();
        })
        break;
      case 'trippyTriangles':
        fill(this.color);
        beginShape();
        this.childNodes.forEach((child) => {
          if (child.x <= width && child.y <= height) {
            vertex(child.x, child.y);
          }
        })
        endShape(CLOSE);
        break;
      case 'path':
        // fill(this.color);
        // //beginShape();
        // push();
        // stroke(this.color);
        // strokeWeight(10);
        // const set = new Set();
        // let currentChild = this.childNodes[0];
        // while (set.size < percentOfNodesToHitBeforeStopping * this.childNodes.length) {
        //   console.log(currentChild);
        //   if (currentChild.x <= width && currentChild.y <= height) {
        //     //vertex(currentChild.x, currentChild.y);
        //   }
        //   set.add(currentChild);
        //   const nextChild = this.findClosestSibling(currentChild, set);
        //   line(currentChild.x, currentChild.y, nextChild?.x ?? 0, nextChild?.y ?? 0);
        //   currentChild = nextChild;
        // }
        // //endShape(CLOSE);
        // pop();
        // break;
        fill(this.color);
        push();
        stroke(this.color);
        strokeWeight(childSize / 2);
        // TODO: Make this work with multiple paths
        const path = this.generatePath();
        for (let i = 0; i < path.length - 1; i++) {
          line(path[i].x, path[i].y, path[i + 1].x, path[i + 1].y);
        }
        pop();
        break;
    }
  }

  maybeMakeNewNode() {
    if (Math.random() < childGenerationChance / ((this.childNodes.length / maxChilds) + 0)) {
      const newChild = new ChildNode(this.x + getRandomInts(-nodeSize * childDistanceMultiplier, nodeSize * childDistanceMultiplier), this.y + getRandomInts(-nodeSize * childDistanceMultiplier, nodeSize * childDistanceMultiplier), this.color);
      this.childNodes.push(newChild);
    }
  }

  // findClosestSibling(child, set) {
  //   let currentClosest = null;
  //   let currentSmallestDistance = Infinity;
  //   this.childNodes.forEach((otherChild) => {
  //     if (!set.has(otherChild)) {
  //       const distance = child.distanceTo(otherChild);
  //       if (distance < currentSmallestDistance) {
  //         currentClosest = otherChild;
  //         currentSmallestDistance = distance;
  //       }
  //     }
  //   })
  //   return currentClosest;
  // }

  generatePath() {
    const path = [];
    const visited = new Set();
    let currentNode = this.childNodes[0];
    path.push(currentNode);
    visited.add(currentNode);
    let attempts = 0;

    while (visited.size < this.childNodes.length && attempts < 100) {
      let nearestNode = null;
      let nearestDistance = Infinity;

      this.childNodes.forEach((node) => {
        if (!visited.has(node)) {
          const distance = currentNode.distanceTo(node);
          if (distance < nearestDistance && !this.wouldCross(path, currentNode, node)) {
            nearestDistance = distance;
            nearestNode = node;
          }
        }
      });

      if (nearestNode) {
        path.push(nearestNode);
        visited.add(nearestNode);
        currentNode = nearestNode;
      } else {
        attempts++;
      }
    }

    return path;
  }

  wouldCross(path, currentNode, nextNode) {
    for (let i = 0; i < path.length - 1; i++) {
      if (this.linesCross(path[i], path[i + 1], currentNode, nextNode)) {
        return true;
      }
    }
    return false;
  }

  // Some github copilot nonsense, PLEASE don't ask me to explain it
  // But boy howdy does it work
  linesCross(a, b, c, d) {
    const det = (b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x);
    if (det === 0) {
      return false;
    }
    const lambda = ((d.y - c.y) * (d.x - a.x) + (c.x - d.x) * (d.y - a.y)) / det;
    const gamma = ((a.y - b.y) * (d.x - a.x) + (b.x - a.x) * (d.y - a.y)) / det;
    return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
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
    if (this.x + childSize / 2 <= width) {
      switch (nodeModes.get(nodeMode % nodeModes.size)) {
        case 'balls':
          fill(this.color);
          circle(this.x, this.y, childSize);
          break;
        case 'trippyTriangles':
          break;
      }
    }
  }

  distanceTo(otherChild) {
    return Math.pow(this.x - otherChild.x, 2) + Math.pow(this.y - otherChild.y, 2);
  }
}

function setUpSliders() {
  textSize(10);
  fill(255, 255, 255);

  const button = createButton('Toggle mode');
  button.size(170);
  button.mouseClicked(() => nodeMode++);

  childRepulsionRangeSlider = createSlider(1, 50, 20, 1);
  childRepulsionForceSlider = createSlider(1, 20, 10, 1);
  pushFromParentForceSlider = createSlider(1, 20, 10, 1);
  pullFromParentForceSlider = createSlider(0, 10, 0.5, 0.5);
  wiggleChanceSlider = createSlider(0, 1, 0, 0.01);
  childDistanceMultiplierSlider = createSlider(0, 3, 0.5, 0.1);
  childColorRangeSlider = createSlider(0, 50, 10, 1);
  childGenerationChanceSlider = createSlider(0, 0.5, 0.1, 0.001);
  childSizeSlider = createSlider(1, 40, 20, 1);
  maxChildsSlider = createSlider(10, 1000000, 1000, 10);
  frameRateSlider = createSlider(1, 60, 60, 1);
  percentOfNodesToHitBeforeStoppingSlider = createSlider(0, 1, 1, 0.01);

  if (areSlidersBelow) {
    rect(0, height, width, 200);
    fill(0, 0, 0);

    button.position(10, height + 15);
    textSize(10);

    text('Child repulsion range', 10, height + 75);
    childRepulsionRangeSlider.position(10, height + 90);

    text('Child repulsion force', 10, height + 140);
    childRepulsionForceSlider.position(10, height + 155);

    text('Push from parent force', 10, height + 205);
    pushFromParentForceSlider.position(10, height + 220);

    text('Pull from parent force', 10, height + 270);
    pullFromParentForceSlider.position(10, height + 285);

    text('Chance to wiggle', 10, height + 335);
    wiggleChanceSlider.position(10, height + 350);

    text('Child spawning distance multiplier', 200, height + 75);
    childDistanceMultiplierSlider.position(200, height + 90);

    text('Child color range', 200, height + 140);
    childColorRangeSlider.position(200, height + 155);

    text('Child generation chance', 200, height + 205);
    childGenerationChanceSlider.position(200, height + 220);

    text('Child Size', 200, height + 270);
    childSizeSlider.position(200, height + 285);

    text('Max childs (does not delete)', 200, height + 335);
    maxChildsSlider.position(200, height + 350);

    text('Frame rate', 200, height + 405);
    frameRateSlider.position(200, height + 420);

    text('Nodes to vertex through', 200, height + 475);
    percentOfNodesToHitBeforeStoppingSlider.position(200, height + 490);

  } else {
    rect(width, 0, 200, height);
    fill(0, 0, 0);

    button.position(width + 10, 15);
    textSize(10);

    text('Child repulsion range', width + 10, 75);
    childRepulsionRangeSlider.position(width + 10, 90);

    text('Child repulsion force', width + 10, 140);
    childRepulsionForceSlider.position(width + 10, 155);

    text('Push from parent force', width + 10, 205);
    pushFromParentForceSlider.position(width + 10, 220);

    text('Pull from parent force', width + 10, 270);
    pullFromParentForceSlider.position(width + 10, 285);

    text('Chance to wiggle', width + 10, 335);
    wiggleChanceSlider.position(width + 10, 350);

    text('Child spawning distance multiplier', width + 10, 400);
    childDistanceMultiplierSlider.position(width + 10, 415);

    text('Child color range', width + 10, 465);
    childColorRangeSlider.position(width + 10, 480);

    text('Child generation chance', width + 10, 530);
    childGenerationChanceSlider.position(width + 10, 545);

    text('Child Size', width + 10, 595);
    childSizeSlider.position(width + 10, 610);

    text('Max childs (does not delete)', width + 10, 660);
    maxChildsSlider.position(width + 10, 675);

    text('Frame rate', width + 10, 725);
    frameRateSlider.position(width + 10, 740);

    text('Nodes to vertex through', width + 10, 785);
    percentOfNodesToHitBeforeStoppingSlider.position(width + 10, 800);
  }
  percentOfNodesToHitBeforeStoppingSlider.size(170);
  frameRateSlider.size(170);
  maxChildsSlider.size(170);
  childSizeSlider.size(170);
  childGenerationChanceSlider.size(170);
  childColorRangeSlider.size(170);
  childDistanceMultiplierSlider.size(170);
  wiggleChanceSlider.size(170);
  pullFromParentForceSlider.size(170);
  pushFromParentForceSlider.size(170);
  childRepulsionForceSlider.size(170);
  childRepulsionRangeSlider.size(170);
  textSize(40);
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