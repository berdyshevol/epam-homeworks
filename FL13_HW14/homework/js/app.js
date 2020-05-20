'use strict';

const _name = Symbol('name');
const _email = Symbol('email');
const _homeworkResult = Symbol('homeworkResult');

function Student(name, email) {
  this[_name] = name;
  this[_email] = email;
}

Student.prototype.getName = function() {
  return this[_name];
}

Student.prototype.getEmail = function() {
  return this[_email];
}

Student.prototype.addHomeworkResult = function(topic, success) {
  if (!this[_homeworkResult]) {
    this[_homeworkResult] = [];
  }
  this[_homeworkResult].push({topic, success});
}

Student.prototype.getHomeworkResult = function() {
  return this[_homeworkResult];
}

const _students = Symbol('_students');
const _failedLimit = Symbol('_failedLimit');

function FrontendLab(students, failedLimit) {
  this[_students] = students.map(student =>
    new Student(student.name, student.email)
  );
  this[_failedLimit] = failedLimit;
}

FrontendLab.prototype.addHomeworkResults = function({topic, results}) {
  results
    .forEach( result => {
      const student = this[_students].find( student =>
        student.getEmail() === result.email
      );
      if (student) {
        student.addHomeworkResult(topic, result.success);
      }
    });
}

FrontendLab.prototype.printStudentsList = function() {
  this[_students].forEach(student => {
    console.log(`name: ${ student.getName() }, email: ${ student.getEmail() }`);
    console.log(student.getHomeworkResult());
  });

}

FrontendLab.prototype.printStudentsEligibleForTest = function() {
  const countFailures = student =>
    student[_homeworkResult]
      .reduce((count, result) =>
        count + (result.success === false ? 1 : 0)
      , 0);

  this[_students]
    .filter(student => countFailures(student) <= this[_failedLimit])
    .forEach(student => {
      console.log(`name: ${ student.getName() }, email: ${ student.getEmail() }`);
    });
}

// test

// const student = new Student('John', 'john@gmail.com');
// console.log(student.getName());
// console.log(student.getEmail());
// console.log(student.addHomeworkResult('HTML', true));
// console.log(student.getHomeworkResult());

// const lab = new FrontendLab(listOfStudents, 1);
// lab.addHomeworkResults(homeworkResults[0]);
// lab.addHomeworkResults(homeworkResults[1]);
// // lab.printStudentsList();
//
// // lab.printStudentsEligibleForTest();
// lab.addHomeworkResults(homeworkResults[2]);
// lab.addHomeworkResults(homeworkResults[3]);
// lab.addHomeworkResults(homeworkResults[4]);
// lab.printStudentsEligibleForTest();