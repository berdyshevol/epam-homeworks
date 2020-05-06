'use strict';

function Fighter(param) {
  this.win = 0;
  this.loss = 0;
  this.name = param.name;
  this.damage = param.damage;
  this.hp = param.hp;
  this.totalHp = param.hp;
  this.strength = param.strength;
  this.agility = param.agility;
  return {
    getName: () => this.name,
    getDamage: () => this.damage,
    getStrength: () => this.strength,
    getAgility: () => this.agility,
    getHealth: () => this.hp,
    attack: attack.bind(this),
    heal: heal.bind(this),
    addLoss: () => this.loss++,
    addWin: () => this.win++,
    dealDamage: dealDamage.bind(this),
    logCombatHistory: logCombatHistory.bind(this)
  };
}

const attack = function(defender) {
  const maxProbability = 100;
  const successProbability =
    maxProbability - defender.getStrength() - defender.getAgility();
  const random = Math.random() * maxProbability;
  if (random < successProbability) { // attack is successful
    defender.dealDamage(this.damage);
    console.log(
      `${this.name} makes ${this.damage} damage to ${defender.getName()}`
    );
  } else {
    console.log(`${this.name} attack is missed`);
  }
}

const heal = function(hp) {
  this.hp += hp;
  if (this.hp > this.totalHp) {
    this.hp = this.totalHp;
  }
}

const dealDamage = function(hp) {
  this.hp -= hp;
  if (this.hp < 0) {
    this.hp = 0;
  }
}

const logCombatHistory = function() {
  console.log(`Name: ${this.name}, Wins: ${this.win}, Losses: ${this.loss}`);
}

function battle(fighter1, fighter2) {
  const isDead = fighter => {
    if (fighter.getHealth() === 0) {
      console.log(`${fighter.getName()} is dead and can't fight`);
      return true;
    }
    return false;
  };
  if (isDead(fighter1)) {
    return;
  }
  if (isDead(fighter2)) {
    return;
  }
  while(fighter1.getHealth() !== 0 && fighter2.getHealth() !== 0) {
    fighter1.attack(fighter2);
    fighter2.attack(fighter1);
  }
  if (fighter1.getHealth() !== 0) {
    console.log(`${fighter1.getName()} has won!`);
    fighter1.addWin();
    fighter2.addLoss();
  } else {
    console.log(`${fighter2.getName()} has won!`);
    fighter2.addWin();
    fighter1.addLoss();
  }
}

const myFighter1 = new Fighter(
  {name: 'Maximus', damage: 20, strength: 2, agility: 2, hp: 100}
);
const myFighter2 = new Fighter(
  {name: 'Commodus', damage: 20, strength: 20, agility: 20, hp: 100}
);
//
const name = myFighter1.getName();
console.log(name)
// console.log(myFighter1.name)

// battle(myFighter1, myFighter2);
// myFighter1.logCombatHistory();
// myFighter2.logCombatHistory();
//
// battle(myFighter1, myFighter2);
// myFighter1.logCombatHistory();
// myFighter2.logCombatHistory();
