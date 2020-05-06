// Your code goes here
let str = prompt('Input a word');
if (isEmptyString(str)
    || isStringSpacesOnly(str)) {
    alert('Invalid value');
} else {
    alert(getMiddleString(str));
}

function isEmptyString(str) {
    return str.length === 0;
}

function isStringSpacesOnly(str) {
    return str.split('').every(c => c === ' ');
}

function getMiddleString(str) {
    if (str.length % 2 === 0) {
        return str.substr(str.length / 2 - 1, 2);
    } else {
        return str.charAt(Math.floor(str.length / 2));
    }
}