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
  [1, 'triangles'],
  [2, 'path'],
  [3, 'shape'],
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
let reflectMode = 0;

let buffer;

function setup() {
  angleMode(DEGREES);
  noStroke();
  let canvas;
  if (areSlidersBelow) {
    canvas = createCanvas(width, height + 1000);
  } else {
    canvas = createCanvas(width + 200, height);
  }
  setUpSliders();
  nodes.push(new Node(width/2, height/2));

  buffer = createGraphics(width, height);
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

  rect(0, 0, width, height);
  
  push();
  fill(255, 255, 255);
  text(`${nodeModes.get(nodeMode % nodeModes.size)}`, 20, 40);
  pop();

  push();
  if (reflectMode % 2 === 1) {
    translate(-width / 6, -height / 6);
  }
  fill(0, 0, 0);
  nodes.forEach((node) => {
    node.draw();
  })
  pop();

  if (reflectMode % 2 === 1) {
    push();
    translate(1/2 * width, 1/2 * height);
    rotate(180);
    translate(-2/3 * width, -2/3 * height);
    // translate(3/4 * width, 3/4 * height);
    fill(0, 0, 0);
    nodes.forEach((node) => {
      node.draw();
    })
    pop();
  }
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
    fill(this.color);
    circle(this.x, this.y, nodeSize);
    switch (nodeModes.get(nodeMode % nodeModes.size)) {
      case 'balls':
        this.childNodes.forEach((child) => {
          child.draw();
        })
        break;
      case 'triangles':
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
        push();
        strokeWeight(childSize / 2);
        const usedNodes = [];
        let totalUsedNodes = 0;
        while (totalUsedNodes < percentOfNodesToHitBeforeStopping * this.childNodes.length) {
          const path = this.generatePath(usedNodes);
          stroke(path[0].color);
          for (let i = 0; i < path.length - 1; i++) {
            if (path[i].x <= width && path[i].y <= height && path[i + 1].x <= width && path[i + 1].y <= height) {
              line(path[i].x, path[i].y, path[i + 1].x, path[i + 1].y);
            }
          }
          usedNodes.push(path);
          totalUsedNodes += path.length;
        }

        pop();
        break;
      case 'shape':
        const nodesToDrawThrough1 = [];
        const nodesToDrawThrough2 = [];
        const nodesToDrawThrough3 = [];
        const howMany = percentOfNodesToHitBeforeStopping * 100;
        for (let i = 0; i < howMany; i++) {
          const angle = 360 / howMany * i;

          const p1 = { x: this.x + cos(angle) * width, y: this.y + sin(angle) * height };
          const p2 = { x: this.x, y: this.y };
          const ray = { p1, p2 };

          const interceptingCircles = [];
          for (let j = 0; j < this.childNodes.length; j++) {
            const circle = {
              x: this.childNodes[j].x,
              y: this.childNodes[j].y,
              radius: childSize / 2,
            }
            if (rayInterceptsCircle(ray, circle)) {
              interceptingCircles.push(this.childNodes[j]);
            }
          }
          let nodeToUse1 = interceptingCircles[getRandomInts(0, interceptingCircles.length)];
          let nodeToUse2 = interceptingCircles[0];
          let nodeToUse3 = interceptingCircles[0];
          for (let k = 1; k < interceptingCircles.length; k++) {
            const currentDist = interceptingCircles[k].distanceTo({ x: this.x, y: this.y });
            if (currentDist > nodeToUse2.distanceTo({ x: this.x, y: this.y })) {
              nodeToUse2 = interceptingCircles[k];
            }
            if (currentDist < nodeToUse3.distanceTo({ x: this.x, y: this.y })) {
              nodeToUse3 = interceptingCircles[k];
            }
          }
          if (nodeToUse1) {
            nodesToDrawThrough1.push(nodeToUse1);
          }
          if (nodeToUse2) {
            nodesToDrawThrough2.push(nodeToUse2);
          }
          if (nodeToUse3) {
            nodesToDrawThrough3.push(nodeToUse3);
          }
        }
        push();
        strokeWeight(4);
        noFill();
        stroke(this.color);
        beginShape();
        nodesToDrawThrough2.forEach((n) => {
          if (n.x <= width && n.y <= height) {
            curveVertex(n.x, n.y);
          }
        })
        endShape(CLOSE);

        beginShape();
        nodesToDrawThrough3.forEach((n) => {
          if (n.x <= width && n.y <= height) {
            vertex(n.x, n.y);
          }
        })
        endShape(CLOSE);
        pop();

        push();
        strokeWeight(4);
        noFill();
        stroke(255 - this.color._getRed(), 255 - this.color._getGreen(), 255 - this.color._getBlue());
        beginShape();
        nodesToDrawThrough1.forEach((n) => {
          if (n.x <= width && n.y <= height) {
            curveVertex(n.x, n.y);
          }
        })
        endShape(CLOSE);
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

  generatePath(usedNodes) {
    const path = [];
    const visited = new Set();
    let currentNode = this.getNextUnusedNode(usedNodes);
    path.push(currentNode);
    visited.add(currentNode);
    let attempts = 0;

    while (visited.size < this.childNodes.length && attempts < 100) {
      let nearestNode = null;
      let nearestDistance = Infinity;

      this.childNodes.forEach((node) => {
        if (!visited.has(node) && !usedNodes.some((usedPath) => usedPath.includes(node))) {
          const distance = currentNode.distanceTo(node);
          if (distance < nearestDistance && !this.wouldCross(path, currentNode, node, usedNodes)) {
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

  wouldCross(path, currentNode, nextNode, usedNodes) {
    for (let i = 0; i < path.length - 1; i++) {
      if (this.linesCross(path[i], path[i + 1], currentNode, nextNode)) {
        return true;
      }
    }
    for (let i = 0; i < usedNodes.length; i++) {
      for (let j = 0; j < usedNodes[i].length - 1; j++) {
        if (this.linesCross(usedNodes[i][j], usedNodes[i][j + 1], currentNode, nextNode)) {
          return true
        }
      }
    }
    return false;
  }

  // Some github copilot nonsense, please don't ask me to explain it
  // But boy howdy does it kinda work
  linesCross(a, b, c, d) {
    const det = (b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x);
    if (det === 0) {
      return false;
    }
    const lambda = ((d.y - c.y) * (d.x - a.x) + (c.x - d.x) * (d.y - a.y)) / det;
    const gamma = ((a.y - b.y) * (d.x - a.x) + (b.x - a.x) * (d.y - a.y)) / det;
    return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
  }

  getNextUnusedNode(usedNodes) {
    let nextNode = null;
    let i = 0;
    while (nextNode === null) {
      nextNode = usedNodes.some((usedPath) => usedPath.includes(this.childNodes[i])) ? null : this.childNodes[i];
      i++;
    }
    return nextNode;
  }
}

// from https://stackoverflow.com/questions/76239528/how-to-check-if-a-line-is-intersecting-with-a-circle-in-javascript
function rayInterceptsCircle(ray, circle) {
  const dx = ray.p2.x - ray.p1.x;
  const dy = ray.p2.y - ray.p1.y;
  const u = Math.min(1, Math.max(0, ((circle.x - ray.p1.x) * dx + (circle.y - ray.p1.y) * dy) / (dy * dy + dx * dx)));
  const nx = ray.p1.x + dx * u - circle.x;
  const ny = ray.p1.y + dy * u - circle.y;
  return nx * nx + ny * ny < circle.radius * circle.radius;
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
        case 'triangles':
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

  const reflect = createButton('Toggle reflect');
  reflect.size(170);
  reflect.mouseClicked(() => reflectMode++);

  childRepulsionRangeSlider = createSlider(1, 50, 20, 1);
  childRepulsionForceSlider = createSlider(1, 20, 10, 1);
  pushFromParentForceSlider = createSlider(1, 20, 10, 1);
  pullFromParentForceSlider = createSlider(0, 10, 0.5, 0.5);
  wiggleChanceSlider = createSlider(0, 1, 0, 0.01);
  childDistanceMultiplierSlider = createSlider(0, 3, 0.5, 0.1);
  childColorRangeSlider = createSlider(0, 50, 20, 1);
  childGenerationChanceSlider = createSlider(0, 0.5, 0.1, 0.001);
  childSizeSlider = createSlider(1, 40, 28, 1);
  maxChildsSlider = createSlider(10, 1000000, 1000, 10);
  frameRateSlider = createSlider(1, 60, 60, 1);
  percentOfNodesToHitBeforeStoppingSlider = createSlider(0, 1, 1, 0.01);

  if (areSlidersBelow) {
    rect(0, height, width, 200);
    fill(0, 0, 0);

    button.position(10, height + 15);
    reflect.position(10, height + 40);
    
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

    text('Nodes to path through', 200, height + 475);
    percentOfNodesToHitBeforeStoppingSlider.position(200, height + 490);

  } else {
    rect(width, 0, 200, height);
    fill(0, 0, 0);

    button.position(width + 10, 15);
    reflect.position(width + 10, 40);

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