'use strict';

function assign(target, ...sources) {
  // for (const obj of sources) {
  //   if (obj) {
  //     for (const key in obj) {
  //       target[key] = obj[key];
  //     }
  //   }
  // }

  sources.forEach(obj => {
    if (obj) {
      Object.keys(obj).forEach(key => {
        target[key] = obj[key];
      })
    }
  });
  return target;
}



// test Object.assign(target, ...sources)

function compare(obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2)
}

// TASK -- DONE
// const paymentCard = {cash: '100$'};
// const creditCard = {limit: '50$', cash: '200$'};
// const result = Object.assign({}, paymentCard, creditCard)
// const myresult = assign({}, paymentCard, creditCard)
// console.log(result)
// console.log(myresult)
// compare(result, myresult)

// // Cloning an object - DONE
// const obj = { a: 1 };
// const copy = Object.assign({}, obj);
// const mycopy = Object.assign({}, obj);
// console.log(copy); // { a: 1 }
// console.log(mycopy); // { a: 1 }
// console.assert(compare(copy, mycopy));


// //Merging objects  --- DONE
// const o1 = { a: 1 };
// const o2 = { b: 2 };
// const o3 = { c: 3 };
// const obj = Object.assign(o1, o2, o3);
// const myobj = assign(o1, o2, o3);
// console.log('obj: ', obj); // { a: 1, b: 2, c: 3 }
// console.log('myobj: ', myobj); // { a: 1, b: 2, c: 3 }
// console.log('o1', o1);  // { a: 1, b: 2, c: 3 }, target object itself is changed.
// console.assert(compare(obj, myobj));



// Merging objects with same properties  -- DONE
// const o1 = { a: 1, b: 1, c: 1 };
// const o2 = { b: 2, c: 2 };
// const o3 = { c: 3 };
// const obj = Object.assign({}, o1, o2, o3);
// const myobj = assign({}, o1, o2, o3);
// console.log('obj',obj); // { a: 1, b: 2, c: 3 }
// console.log('myobj',myobj);
// console.assert(compare(obj, myobj));

// // Copying symbol-typed properties      ----  NOT WORKING
// const o1 = { a: 1 };
// const o2 = { [Symbol('foo')]: 2 };
//
// const obj = Object.assign({}, o1, o2);
// const myobj = assign({}, o1, o2);
// console.log('obj', obj); // { a : 1, [Symbol("foo")]: 2 } (cf. bug 1207182 on Firefox)
// console.log('Object.getOwnPropertySymbols(obj)',Object.getOwnPropertySymbols(obj)); // [Symbol(foo)]
// console.log('myobj', myobj); // { a : 1, [Symbol("foo")]: 2 } (cf. bug 1207182 on Firefox)
// console.log('Object.getOwnPropertySymbols(myobj)', Object.getOwnPropertySymbols(myobj)); // [Symbol(foo)]
// console.assert(compare(obj, myobj));

// Properties on the prototype chain and non-enumerable properties cannot be copied
// const obj = Object.create({ foo: 1 }, { // foo is on obj's prototype chain.
//   bar: {
//     value: 2  // bar is a non-enumerable property.
//   },
//   baz: {
//     value: 3,
//     enumerable: true  // baz is an own enumerable property.
//   }
// });
//
// const copy = Object.assign({}, obj);
// console.log(copy); // { baz: 3 }
// const mycopy = Object.assign({}, obj);
// console.log(mycopy); // { baz: 3 }
// console.assert(compare(copy, mycopy));

// Primitives will be wrapped to objects   ---- DONE
// const v1 = 'abc';
// const v2 = true;
// const v3 = 10;
// const v4 = Symbol('foo');
// const obj = Object.assign({}, v1, null, v2, undefined, v3, v4);
// const myobj = assign({}, v1, null, v2, undefined, v3, v4);
// // //Primitives will be wrapped, null and undefined will be ignored.
// //// Note, only string wrappers can have own enumerable properties.
// console.log(obj); // { "0": "a", "1": "b", "2": "c" }
// console.log(myobj); // { "0": "a", "1": "b", "2": "c" }
// console.assert(compare(obj, myobj));


// Exceptions will interrupt the ongoing copying task
// const target = Object.defineProperty({}, 'foo', {
//   value: 1,
//   writable: false
// }); // target.foo is a read-only property
// const mytarget = Object.defineProperty({}, 'foo', {
//   value: 1,
//   writable: false
// }); // target.foo is a read-only property
//
// Object.assign(target, { bar: 2 }, { foo2: 3, foo: 3, foo3: 3 }, { baz: 4 });
// Object.assign(mytarget, { bar: 2 }, { foo2: 3, foo: 3, foo3: 3 }, { baz: 4 });
// // TypeError: "foo" is read-only
// // The Exception is thrown when assigning target.foo
//
// console.log(target.bar);  // 2, the first source was copied successfully.
// console.log(target.foo2); // 3, the first property of the second source was copied successfully.
// console.log(target.foo);  // 1, exception is thrown here.
// console.log(target.foo3); // undefined, assign method has finished, foo3 will not be copied.
// console.log(target.baz);  // undefined, the third source will not be copied either.
//
// console.log(mytarget.bar);  // 2, the first source was copied successfully.
// console.log(mytarget.foo2); // 3, the first property of the second source was copied successfully.
// console.log(mytarget.foo);  // 1, exception is thrown here.
// console.log(mytarget.foo3); // undefined, assign method has finished, foo3 will not be copied.
// console.log(mytarget.baz);  // undefined, the third source will not be copied either.

// Copying accessors
// const obj = {
//   foo: 1,
//   get bar() {
//     return 2;
//   }
// };
//
// let copy = Object.assign({}, obj);
// console.log(copy);
// let mycopy = Object.assign({}, obj);
// console.log(mycopy);
// console.assert(compare(mycopy, copy));
// { foo: 1, bar: 2 }
// The value of copy.bar is obj.bar's getter's return value.

// This is an assign function that copies full descriptors
// function completeAssign(target, ...sources) {
//   sources.forEach(source => {
//     let descriptors = Object.keys(source).reduce((descriptors, key) => {
//       descriptors[key] = Object.getOwnPropertyDescriptor(source, key);
//       return descriptors;
//     }, {});
//
//     // By default, Object.assign copies enumerable Symbols, too
//     Object.getOwnPropertySymbols(source).forEach(sym => {
//       let descriptor = Object.getOwnPropertyDescriptor(source, sym);
//       if (descriptor.enumerable) {
//         descriptors[sym] = descriptor;
//       }
//     });
//     Object.defineProperties(target, descriptors);
//   });
//   return target;
// }
//
// copy = completeAssign({}, obj);
// console.log(copy);
// { foo:1, get bar() { return 2 } }