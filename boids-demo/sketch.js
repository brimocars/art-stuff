const width = window.innerWidth;
const height = window.innerHeight;
const boids = [];
const maxBoids = 500;
const maxSpeed = 0.2;
const maxForce = 0.02;
const size = 10;
const radius = 50;

function setup() {
  angleMode(DEGREES);
  colorMode(HSL);
  createCanvas(width, height);
  for (let i = 0; i < maxBoids; i++) {
    boids.push(new Boid(maxSpeed, maxForce, size))
  }
}

function draw() {
  background(0, 0, 0);

  let totalX = 0;
  let totalY = 0;
  for (let i = 0; i < maxBoids; i++) {
    totalX += boids[i].position.x;
    totalY += boids[i].position.y;
  }

  const average = createVector(totalX / maxBoids, totalY / maxBoids);

  boids.forEach((boid) => {
    boid.getNeighbors(boids, radius)
    boid.update(deltaTime);
    boid.cohesion();
    boid.align();
    boid.separation();
    boid.wander();
    boid.draw();
  })
}


class Boid {
  constructor(maxSpeed, maxForce, size) {
    this.position = createVector(getRandomInts(0, width), getRandomInts(0, height))
    this.velocity = createVector(1, 0).rotate(getRandomInts(0, 360));
    this.acceleration = createVector(0, 0);
    this.maxSpeed = maxSpeed;
    this.maxForce = maxForce;
    this.size = size;
    this.color = color(getRandomInts(0, 360), 75 + getRandomInts(-10, 10), 50);
    this.neighbors = [];
    this.averageNeighborPosition = createVector(0, 0);
    this.averageNeighborVelocity = createVector(0, 0);
    this.futureSpot = createVector(0, 0);
  }

  draw() {
    fill(this.color);
    stroke(this.color);
    circle(this.position.x, this.position.y, this.size);
    // this.neighbors.forEach((neighbor) => {
    //   line(this.position.x, this.position.y, neighbor.position.x, neighbor.position.y);
    // })
  }

  update(deltaTime) {
    this.velocity.add(this.acceleration); // should this use p5.Vector.mult(this.acceleration, deltaTime)?
    this.velocity.limit(this.maxSpeed);
    this.position.add(p5.Vector.mult(this.velocity, deltaTime));

    this.acceleration.set(0, 0);
    this.position.set((this.position.x + width) % width, (this.position.y + height) % height);
  }

  applyForce(force) {
    this.acceleration.add(force.limit(this.maxForce));
  }

  seek(target) {
    const desiredVelocity = p5.Vector.sub(target, this.position);
    desiredVelocity.setMag(this.maxSpeed);
    const force = p5.Vector.sub(desiredVelocity, this.velocity);
    this.applyForce(force)
  }

  flee(target) {
    const desiredVelocity = p5.Vector.sub(this.position, target);
    desiredVelocity.setMag(this.maxSpeed);
    const force = p5.Vector.sub(desiredVelocity, this.velocity);
    this.applyForce(force)
  }

  getNeighbors(boids, radius) {
    this.neighbors = [];
    let neighborPositionX = 0;
    let neighborPositionY = 0;
    let neighborVelocityX = 0;
    let neighborVelocityY = 0;

    boids.forEach((boid) => {
      const distance = this.position.dist(boid.position);
      if (this !== boid && distance < radius) {
        this.neighbors.push(boid);
        neighborPositionX += boid.position.x;
        neighborPositionY += boid.position.y;
        neighborVelocityX += boid.velocity.x;
        neighborVelocityY += boid.velocity.y;
      }
    })

    if (this.neighbors.length) {
      this.averageNeighborPosition = createVector(neighborPositionX / this.neighbors.length, neighborPositionY / this.neighbors.length);
      this.averageNeighborVelocity = createVector(neighborVelocityX / this.neighbors.length, neighborVelocityY / this.neighbors.length);
    }
  }

  calcFuturePosition(time) {
    return p5.Vector.add(this.position, p5.Vector.mult(this.velocity, time));
  }

  cohesion() {
    this.seek(this.averageNeighborPosition);
  }

  separation() {
    this.neighbors.forEach((neighbor) => {
      const distance = this.position.dist(neighbor.position)
      this.flee(p5.Vector.mult(neighbor.position, 1 / distance));
    })
  }

  align() {
    this.applyForce(p5.Vector.sub(this.velocity, this.averageNeighborVelocity));
  }

  wander() {
    const futureSpot = this.calcFuturePosition(2);
    if (Math.random() > 0.95) {
      const placeToGo = p5.Vector.add(futureSpot, createVector(getRandomInts(-100, 100), getRandomInts(-100, 100)));
      this.futureSpot = placeToGo;
    }
    this.seek(this.futureSpot);
  }
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