'use strict';

const DELTA_SPEED_UP = 20;
const DELTA_SPEED_DOWN = -20;
const SPEED_UP_INTERVAL = 2000;
const SPEED_DOWN_INTERVAL = 1500;
const VEHICLE_MAX_SPEED = 70;
const CAR_MAX_SPEED = 80;
const MOTORCYCLE_MAX_SPEED = 90;

function speedUp() {
  this.speed += DELTA_SPEED_UP;
  if (this.speed > this.recordSpeed) {
    this.recordSpeed = this.speed;
  }
  this.showMessage();
  if (this.speed > this.maxSpeed) {
    console.log('speed is to high, SLOW DOWN!');
  }
}

function speedDown() {
  this.speed += DELTA_SPEED_DOWN;
  if (this.speed <= 0) {
    this.speed = 0;
    clearInterval(this.breaking);
    this.breaking = null;
    this.showFinalMessage();
    return;
  }
  this.showMessage();
}

function Vehicle(color, engine) {
  this.engine = engine;
  this.color = color;
  this.maxSpeed = VEHICLE_MAX_SPEED;
  this.model = 'unknown model';
  this.speed = 0;
  this.recordSpeed= 0;
  this.breaking = null;
  this.speedDownBindThis = speedDown.bind(this);
  this.driving = null;
  this.speedUpBindThis = speedUp.bind(this);
}

Vehicle.prototype.getInfo = function() {
  const {engine, color, maxSpeed, model} = this;
  return {engine, color, maxSpeed, model};
}

Vehicle.prototype.upgradeEngine = function(newEngine, maxSpeed) {
  if (this.speed === 0) {
    this.engine = newEngine;
    this.maxSpeed = maxSpeed;
  }
}

Vehicle.prototype.showMessage = function() {
  console.log(this.speed);
}

Vehicle.prototype.showFinalMessage = function() {
  console.log(`Vehicle is stopped. Maximum speed during the drive was ${ this.recordSpeed }`);
}

Vehicle.prototype.run = function() {
  this.driving = setInterval(speedUp.bind(this), SPEED_UP_INTERVAL);
}

Vehicle.prototype.drive = function() {
  if (this.driving) {
    console.log('Already driving');
    return;
  }
  if (this.breaking) {
    clearInterval(this.breaking);
    this.breaking = null;
  }
  this.driving = setInterval(this.speedUpBindThis, SPEED_UP_INTERVAL);
}

Vehicle.prototype.break = function() {
  if (this.breaking) {
    console.log('Already slows down');
  }
  if (this.driving) {
    clearInterval(this.driving);
    this.driving = null;
  }
  this.breaking = setInterval(this.speedDownBindThis, SPEED_DOWN_INTERVAL);
}

function Car(model, color, engine) {
  Vehicle.call(this, color, engine);
  this.model = model;
  this.maxSpeed = CAR_MAX_SPEED;
}

Car.prototype.changeColor = function(newColor) {
  if (this.color === newColor) {
    console.log('The selected color is the same as the previous, please choose another one')
  } else {
    this.color = newColor;
  }
}
Car.prototype.showFinalMessage = function() {
  console.log(`Car ${ this.model } is stopped. Maximum speed during the drive ${ this.recordSpeed }`);
}

Object.setPrototypeOf(Car.prototype, Vehicle.prototype);


function speedUpForMotorcycle() {
  speedUp.call(this);
  if (this.speed - this.maxSpeed > 30) {
    console.log('Engine overheating');
    this.break();
  }
}

function Motorcycle(model, color, engine) {
  Vehicle.call(this, color, engine);
  this.model = model;
  this.speedUpBindThis = speedUpForMotorcycle.bind(this);
  this.maxSpeed = MOTORCYCLE_MAX_SPEED;
}

Motorcycle.prototype.drive = function() {
  if (!this.driving) {
    console.log("Let’s drive");
  }
  Vehicle.prototype.drive.call(this);
}

Motorcycle.prototype.showFinalMessage = function() {
  console.log(`Motorcycle ${ this.model } is stopped. Good drive`);
}

Object.setPrototypeOf(Motorcycle.prototype, Vehicle.prototype);






// test

// const vehicle = new Vehicle('green', 'V8');
// vehicle.upgradeEngine('V8', 100);
// vehicle.getInfo();
// console.log('we want to run');
// vehicle.drive();

// setTimeout(() => {
//   console.log('we want to stop');
//   vehicle.break();
//   // setTimeout(()=>{vehicle.break();}, 4000)
// }, 10000);



// const car = new Car('Ford Mustang', 'black', 'V8');
// car.changeColor('black');
// car.changeColor('orange');
// car.drive();
// car.upgradeEngine('V8', 140);
// car.getInfo();

const motorcycle = new Motorcycle('suzuki', 'white', 'V8');
motorcycle.drive();

