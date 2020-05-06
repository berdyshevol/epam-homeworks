'use strict';

// Task 1
const convert = (...arr) => {
    const convertType = value => {
        if (typeof value === 'string') {
            return parseInt(value);
        } else if (typeof value === 'number') {
            return value.toString();
        } else {
            return value;
        }
    }
    const returnArr = [];
    for (const value of arr) {
        returnArr.push(convertType(value));
    }
    return returnArr;
}

// Task 2
const executeforEach = (arr, callback) => {
    for (const value of arr) {
        callback(value);
    }
};

// Task 3
const mapArray = (arr, callback) => {
    const resultArr = [];
    const convertToNumber = x => +x;
    const pushToResultArray = x => resultArr.push(callback(convertToNumber(x)));
    executeforEach(arr, pushToResultArray);
    return resultArr;
};

// Task 4
const filterArray = (arr, callback) => {
    const resultArr = [];
    const filterOutArray = value => {
        if (callback(value)) {
            resultArr.push(value);
        }
    };
    executeforEach(arr, filterOutArray);
    return resultArr;
};

// Task 5
const containsValue = (arr, value) => {
    let result = false;
    const any = x => {
        if (x === value) {
            result = true;
        }
    };
    executeforEach(arr, any);
    return result;
};

// Task 6
const flipOver = str => {
    let newString = '';
    for (let i = str.length - 1; i >= 0; i--) {
        newString += str.charAt(i);
    }
    return newString;
};

// Task 7
const makeListFromRange = arr => {
    let [from, to] = arr;
    if (from > to) {
        [from, to] = [to, from];
    }
    const resultArray = [];

    for (let i = from; i <= to; i++) {
        resultArray.push(i);
    }
    return resultArray;
};

// Task 8
const getArrayOfKeys = (array, key) => {
    let resultArr = [];
    for (const obj of array) {
        if (obj[key]) {
            resultArr.push(obj[key]);
        }
    }
    return resultArr;
};

// Task 9
const substitute = arr => {
    const minNumber = 10;
    const maxNumber = 20;
    const resultArray = [];
    const isInRange = x => minNumber < x && x < maxNumber;
    const substituteItem = value => resultArray.push(
                                       isInRange(value) ? '*' : value
                                    );
    mapArray(arr, substituteItem);
    return resultArray;
};

// Task 10
const getPastDay = (date, days) => {
    const millisecondsInADay = 86400000;
    return new Date(date.getTime() - millisecondsInADay * days).getDate();
};

// Task 11
const formatDate = (date) => {
    const maxDigit = 9;
    const formatted = number => number <= maxDigit ? '0' + number : number.toString();
    return `${date.getFullYear()}/${formatted(date.getMonth() + 1)}/${formatted(date.getDate())}` +
    ` ${formatted(date.getHours())}:${formatted(date.getMinutes())}`;
};


// test Task 1
const arr1 = [1, '2', '3', 4];
// console.log(convert('1', 2, 3, '4'));
console.assert(isEqual(arr1, convert('1', 2, 3, '4')));

//test Task 2
const arr2 = [];
executeforEach([1,2,3], el => arr2.push(el * 2));
console.assert(isEqual(arr2, [2, 4, 6]));

// test Task 3
const arr3 = [2, '5', '8'];
const arr3Result = mapArray(arr3, el => el + 3);
const arr3Test = [5, 8, 11];
// console.dir(arr3Result);
console.assert(isEqual(arr3Result, arr3Test));

// test Task 4
const arr4 = [2, 5, 8, 3, 10];
const arr4Result = filterArray(arr4, el => el % 2 === 0);
const arr4Test = [2, 8, 10];
// console.log(arr4Result );
console.assert(isEqual(arr4Test, arr4Result));

// test Task 5
console.assert(containsValue([2, 5, 8], 2));
console.assert(!containsValue([12, 4, 6], 5));

// test Task 6
console.assert(flipOver('hey world') === 'dlrow yeh');
console.assert(flipOver('h') === 'h' );
console.assert(flipOver('') === '');

// test Task 7
const arr7Result = makeListFromRange([2, 7]);
const arr7Test = [2, 3, 4, 5, 6, 7];
// console.log(arr7Result);
console.assert(isEqual(arr7Test, arr7Result));

const arr7Result1 = makeListFromRange([7, 2]);
const arr7Test1 = [2, 3, 4, 5, 6, 7];
// console.log(arr7Result1);
console.assert(isEqual(arr7Test1, arr7Result1));

const arr7Result2 = makeListFromRange([2, 2]);
const arr7Test2 = [2];
// console.log(arr7Result2);
console.assert(isEqual(arr7Test2, arr7Result2));

// test Task 8
const fruits = [
    { name: 'apple', weight: 0.5 },
    { name: 'pineapple', weight: 2 }
];
const arr8Test = [ 'apple', 'pineapple' ];
const arr8Result = getArrayOfKeys(fruits, 'name');
// console.log(arr7Result);
console.assert(isEqual(arr8Result, arr8Test));

// test Task 9
const arr9Result = substitute([58, 14, 48, 12, 31, 19, 10]);
const arr9Test = [58, '*', 48, '*', 31, '*', 10];
// console.dir(arr9Result);
console.assert(isEqual(arr9Result, arr9Test));

// test Task 10
const date = new Date(2020, 0, 2);
// console.log(getPastDay(date, 1)); // 1, (1 Jan 2020)
console.assert(getPastDay(date, 1) === 1);
// console.log(getPastDay(date, 2)); // 31, (31 Dec 2019)
console.assert(getPastDay(date, 2) === 31);
// console.log(getPastDay(date, 365)); // 2, (2 Jan 2019)
console.assert(getPastDay(date, 365) === 2);

// test Test 11
console.log(formatDate(new Date('6/15/2019 09:15:00')));
console.log(formatDate(new Date()));
console.assert(formatDate(
    new Date('6/15/2019 09:15:00')) === '2019/06/15 09:15');

function isEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (const index in arr1) {
        if (arr1[index] !== arr2[index]) {
            return false;
        }
    }
    return true;
}
