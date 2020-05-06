const letterCount = function(str, substr) {
    if (substr === '') {
        return 0;
    }
    str = str.toLowerCase();
    substr = substr.toLowerCase();
    let count = 0;
    let current = str.indexOf(substr);
    while (current !== -1) {
        count++;
        current = str.indexOf(substr, current + 1);
    }
    return count;
}

// console.log(letterCount("eeHeHeHee", "He"))
console.assert(letterCount("eeHeHeHee", "He") === 3);
// console.log(letterCount("Maggy","g")); //=> 2
console.assert(letterCount("Maggy","g") === 2);
// console.log(letterCount("Barry", "b")); //=>1
console.assert(letterCount("Barry","b") === 1);
// console.log(letterCount("","z")); //=>0
console.assert(letterCount("","z") === 0);
console.assert(letterCount("","") === 0);