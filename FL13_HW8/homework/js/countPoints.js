const countPoints = function(array) {
    let score = 0;
    const isBigger = (a, b) => (a > b);
    const calculatePoints = function(x, y) {
        let score = 0;
        if (isBigger(x, y)) {
            score += 3;
        } else if (x === y) {
            score += 1;
        }
        return score;
    }
    for (let item of array) {
        const [x, y] = item.split(':');
        score += calculatePoints(x, y);
    }
    return score;
}

const test1 = countPoints(['3:1', '1:0', '0:0', '1:2', '4:0', '2:3', '1:1', '0:1', '2:1', '1:0']);
console.log(`1) ${test1}`);
console.assert(test1 === 17);
const test2 = countPoints(['1:1', '1:2', '2:0', '4:2', '0:1', '2:3', '1:1', '0:1', '1:1', '3:0']);
console.log(`2) ${test2}`);
console.assert(test2 === 12);