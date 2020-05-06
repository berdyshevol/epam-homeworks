const storeNames = (...args) => args;

let res = storeNames('Nick Fury', 'Iron Man', 'Doctor Strange', 'Oleg');
// console.log(res);
console.assert(Array.isArray(res));