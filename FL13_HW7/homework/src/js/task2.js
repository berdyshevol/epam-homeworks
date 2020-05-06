'use strict'

// Initial Settings
const ATTEMPTS = 3;
const MAX = 5;
const PRIZE = [100, 50, 25];

// main logic
if (step1(window.confirm('Do you want to play a game?'))) {
    // initialization
    let newGame = true;
    while(newGame) {
        game();
        if (!doYouWantToPlayAgain()) {
            newGame = false;
        }
    }
}

// functions
function step1(result) {
    if (!result) {
        alert('You did not become a billionaire, but can.');
        return false;
    }
    return true;
}

function renewSession(session) {
    return {max: 2 * session.max,
            attempt: 0,
            prize: session.prize.map(x => 2 * x),
            totalPrize: session.totalPrize
           };
}

function game() {
    let session = {max: MAX,
                   attempt: 0,
                   prize: [...PRIZE],
                   totalPrize: 0
                  };

    while (session.attempt < ATTEMPTS) {
        const randomNumber= getRandomNumber(session.max);
        const guessNumber = askUserGuess(session,randomNumber);
        if (guessNumber === null) {
            break;
        }
        if (randomNumber === +guessNumber) {
            alert(`Congratulation, you won!
Your prize is: ${session.prize[session.attempt]}$.`);
            session.totalPrize += session.prize[session.attempt];
            if (doYouWantToContinue()) {
                session = renewSession(session);
            } else {
                break;
            }
        } else {
            session.attempt++;
        }
    }
    thankYouForParticipation(session.totalPrize);
}

function getRandomNumber(max) {
    return Math.floor(Math.random() * (max + 1));
}

function askUserGuess(session) {
    const attemptsLeft = ATTEMPTS - session.attempt;
    const promptMessage =
        `Choose a roulette pocket number from 0 to ${session.max}
Attempt left: ${attemptsLeft} 
Total prize: ${session.totalPrize}$
Possible prize on current event: ${session.prize[session.attempt]}$`;
    return prompt(promptMessage);
}

function doYouWantToContinue() {
    return confirm('Do you want to continue');
}

function thankYouForParticipation(totalPrize) {
    alert(`Thank you for your participation.
Your prize is: ${totalPrize}$`);
}

function doYouWantToPlayAgain() {
    return confirm('Do you want to play again?');
}