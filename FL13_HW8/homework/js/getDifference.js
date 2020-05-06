const getDifference = (a, b) => (a > b ? a - b : b - a);

console.assert(getDifference(5,3) === 2);
console.assert(getDifference(3,5) === 2);
console.assert(getDifference(3,3) === 0);