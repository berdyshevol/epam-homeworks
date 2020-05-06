'use strict';

let checkNumber = +prompt('Please, enter check number', '0');
let percentage = +prompt('Please, enter tip percentage', '0');
if (!isNaN(checkNumber) && !isNaN(percentage)
    && checkNumber >= 0
    && percentage >= 0 && percentage <= 100) {
    let tip = checkNumber * percentage / 100;
    let total = checkNumber + tip;
    alert(`Check number: ${smartToFixed(checkNumber)}
Tip: ${smartToFixed(percentage)}
Tip amount: ${smartToFixed(tip)}
Total sum to pay: ${smartToFixed(total)}`
        );
} else {
    showMessageInvalidData();
}

function smartToFixed(num) {
    return Math.floor(num * 100) / 100;
}

function showMessageInvalidData() {
    alert("Invalid input data");
}
