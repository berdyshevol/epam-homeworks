'use strict';

class Fighter {
    constructor(param) {
        this._win = 0;
        this._loss = 0;
        this._name = param.name;
        this._damage = param.damage;
        this._hp = param.hp;
        this._totalHp = param.hp;
        this._strength = param.strength;
        this._agility = param.agility;
    }
    getName() {
        return this._name;
    }
    getDamage() {
        return this._damage;
    }
    getStrength() {
        return this._strength;
    }
    getAgility() {
        return this._agility;
    }
    getHealth() {
        return this._hp;
    }
    attack(defender) {
        const maxProbability = 100;
        const successProbability = maxProbability - defender.getStrength() - defender.getAgility();
        const random = Math.random() * maxProbability;
        if (random < successProbability) { // attack is successful
            defender.dealDamage(this.getDamage());
            console.log(`${this.getName()} makes ${this.getDamage()} damage to ${defender.getName()}`);
        } else {
            console.log(`${this.getName()} attack is missed`);
        }
    }
    heal(hp) {
        this._hp += hp;
        if (this._hp > this._totalHp) {
            this._hp = this._totalHp;
        }
    }
    addLoss() {
        this._loss++;
    }
    addWin() {
        this._win++;
    }
    dealDamage(hp) {
        this._hp -= hp;
        if (this._hp < 0) {
            this._hp = 0;
        }
    }
    logCombatHistory() {
        console.log(`Name: ${this.getName()}, Wins: ${this._win}, Losses: ${this._loss}`);
    }
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

battle(myFighter1, myFighter2);
myFighter1.logCombatHistory();
myFighter2.logCombatHistory();


// let nameF = myFighter.getName();
// console.log(nameF); // Maximus
// let damage = myFighter.getDamage();
// console.log(damage); // 20
// let strength = myFighter.getStrength();
// console.log(strength); // 30
// let agility = myFighter.getAgility();
// console.log(agility); // 25
// let health = myFighter.getHealth();
// console.log(health); // 100