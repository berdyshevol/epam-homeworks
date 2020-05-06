'use strict';

function Fighter(param) {
  let win = 0;
  let loss = 0;
  let name = param.name;
  let damage = param.damage;
  let hp = param.hp;
  const totalHp = param.hp;
  let strength = param.strength;
  let agility = param.agility;

  const heal = function(hpToIncrease) {
    hp += hpToIncrease;
    if (hp > totalHp) {
      hp = totalHp;
    }
  }

  const dealDamage = function(hpToDecrease) {
    hp -= hpToDecrease;
    if (hp < 0) {
      hp = 0;
    }
  }

  const logCombatHistory = function() {
    console.log(`Name: ${name}, Wins: ${win}, Losses: ${loss}`);
  }

  const attack = function(defender) {
    const maxProbability = 100;
    const successProbability =
      maxProbability - defender.getStrength() - defender.getAgility();
    const random = Math.random() * maxProbability;
    if (random < successProbability) { // attack is successful
      defender.dealDamage(damage);
      console.log(
        `${name} makes ${damage} damage to ${defender.getName()}`
      );
    } else {
      console.log(`${name} attack is missed`);
    }
  }

  return {
    getName: () => name,
    getDamage: () => damage,
    getStrength: () => strength,
    getAgility: () => agility,
    getHealth: () => hp,
    attack,
    heal,
    addLoss: () => loss++,
    addWin: () => win++,
    dealDamage,
    logCombatHistory
  };
}

const isDead = fighter => {
  if (fighter.getHealth() === 0) {
    console.log(`${fighter.getName()} is dead and can't fight`);
    return true;
  }
  return false;
};

const congratulation = (winner, loser) => {
  console.log(`${winner.getName()} has won!`);
  winner.addWin();
  loser.addLoss();
}

function battle(fighter1, fighter2) {
  if (isDead(fighter1) || isDead(fighter2)) {
    return;
  }
  while(fighter1.getHealth() !== 0 && fighter2.getHealth() !== 0) {
    fighter1.attack(fighter2);
    fighter2.attack(fighter1);
  }
  if (fighter1.getHealth() !== 0) {
    congratulation(fighter1, fighter2);
  } else {
    congratulation(fighter2, fighter1);
  }
}

const myFighter1 = new Fighter(
  {name: 'Maximus', damage: 20, strength: 2, agility: 2, hp: 100}
);
const myFighter2 = new Fighter(
  {name: 'Commodus', damage: 20, strength: 20, agility: 20, hp: 100}
);

battle(myFighter1, myFighter2);
myFighter1.logCombatHistory();
myFighter2.logCombatHistory();
// battle(myFighter1, myFighter2);
// myFighter1.logCombatHistory();
// myFighter2.logCombatHistory();

// let nameF = myFighter1.getName();
// console.log(nameF); // Maximus
// console.log(myFighter1.name);
// let damage = myFighter1.getDamage();
// console.log(damage); // 20
// let strength = myFighter1.getStrength();
// console.log(strength); // 30
// let agility = myFighter1.getAgility();
// console.log(agility); // 25
// let health = myFighter1.getHealth();
// console.log(health); // 100

// console.log(myFighter1.heal());
// console.log(myFighter1.logCombatHistory());