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

function FrontendLab(students, failedLimit) {
  const _students = students.map(student =>
    new Student(student.name, student.email)
  );
  const _failedLimit = failedLimit;

  const methods = {};

  methods.printStudentsList = function() {
    _students.forEach(student => {
      console.log(`name: ${ student.getName() }, email: ${ student.getEmail() }`);
      console.log(student.getHomeworkResult());
    });
  }

  methods.addHomeworkResults = function({topic, results}) {
    results
      .forEach( result => {
        const student = _students.find( student =>
          student.getEmail() === result.email
        );
        if (student) {
          student.addHomeworkResult(topic, result.success);
        }
      });
  }

  methods.printStudentsEligibleForTest = function() {
    const countFailures = student =>
      student.getHomeworkResult()
        .reduce((count, result) =>
          count + (result.success === false ? 1 : 0)
          , 0);

    _students
      .filter(student => countFailures(student) <= _failedLimit)
      .forEach(student => {
        console.log(`name: ${ student.getName() }, email: ${ student.getEmail() }`);
      });
  }
  return methods;
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

// lab.printStudentsList();

// lab.printStudentsEligibleForTest();

// lab.addHomeworkResults(homeworkResults[2]);
// lab.addHomeworkResults(homeworkResults[3]);
// lab.addHomeworkResults(homeworkResults[4]);
// lab.printStudentsEligibleForTest();

// console.log(lab)