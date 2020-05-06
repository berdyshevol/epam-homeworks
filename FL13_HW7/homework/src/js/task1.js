const alertMessage = {
    'is an empty line or Esc': 'Canceled.',
    'length less than 4 symbols': 'I don\'t know any users having name length less than 4 symbols',
    'another string': 'I don’t know you',
    'Wrong password': 'Wrong password'
}
const users = {
    'User': 'UserPass',
    'Admin': 'RootPass'
};

const userGreetLessThan20 = {
    'User': 'Good day, dear User!',
    'Admin': 'Good day, dear Admin!'
};

const userGreetMoreThan20 = {
    'User': 'Good evening, dear User!',
    'Admin': 'Good evening, dear Admin!'
};

// main logic
const login = prompt('Input login');
if (checkLogin(login)) {
    const password = prompt('Input password');
    if (checkPassword(login, password)) {
        greetsUserAppropriately(login);
    }
}

function checkLogin(login) {
    // if (!login) {
    if (login === '' || login === null) {
        showMessage('is an empty line or Esc');
        return false;
    } else if (login.length < 4) {
        showMessage('length less than 4 symbols');
        return false;
    } else if (login in users) {
        return true;
    } else {
        showMessage('another string');
        return false;
    }
}

function checkPassword(login, password) {
    if (password === null || password === '') {
        showMessage('is an empty line or Esc');
        return false;
    } else if (users[login] === password) {
        return true;
    } else {
        showMessage('Wrong password');
        return false;
    }
}

function greetsUserAppropriately(login) {
    const hour = new Date().getHours();
    if (hour < 20) {
        alert(userGreetLessThan20[login]);
    } else {
        alert(userGreetMoreThan20[login]);
    }
}

function showMessage(key) {
    alert(alertMessage[key]);
}
