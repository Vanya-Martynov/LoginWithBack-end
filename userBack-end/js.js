let btnCreate = document.getElementById('send'),
    usersDiv = document.getElementById('users'),
    btnShowModal = document.getElementById('newUser'),
    modalWindow = document.getElementById('modalWindow');
let userName = document.getElementById('userName'),
    userLastName = document.getElementById('userLastName'),
    userEmail = document.getElementById('userEmail'),
    userAge = document.getElementById('userAge'),
    userIdCount = 0,
    isEdit = {
        ready: false,
    },
    userRole;

function getFullName(user) {
    const {firstName, lastName} = user;
    return `${firstName} ${lastName}`;
}

function newUserObj(name, secondName, email, age) {
    let userObj = {};
    userIdCount++;
    userObj.userName = name;
    userObj.userLastName = secondName;
    userObj.userEmail = email;
    userObj.userAge = age;
    userObj.id = `${userIdCount}`;
    return userObj;
}

function creteNewUser(element, userObj) {
    let newUser = document.createElement('div');
    newUser.className = 'personInfo';
    newUser.id = `${userIdCount}`;

    let newUserName = document.createElement('span');
    newUserName.textContent = userObj.userName;
    newUserName.className = 'personInfo' + userIdCount;
    newUserName.classList.add('span');
    newUser.appendChild(newUserName);

    let newBtnEdit = document.createElement('button');
    newBtnEdit.textContent = 'Edit';
    newBtnEdit.className = 'edit';
    newBtnEdit.classList.add('blue');
    newBtnEdit.classList.add('animate');
    newBtnEdit.classList.add('action-button');
    newUser.appendChild(newBtnEdit);

    let newBtnDelete = document.createElement('button');
    newBtnDelete.textContent = 'Delete';
    newBtnDelete.className = 'delete';
    newBtnDelete.classList.add('blue');
    newBtnDelete.classList.add('animate');
    newBtnDelete.classList.add('action-button');
    newUser.appendChild(newBtnDelete);

    let newBtnInfo = document.createElement('button');
    newBtnInfo.textContent = 'Info';
    newBtnInfo.className = 'info';
    newBtnInfo.classList.add('blue');
    newBtnInfo.classList.add('animate');
    newBtnInfo.classList.add('action-button');
    newUser.appendChild(newBtnInfo);

    element.appendChild(newUser);
}

let user,
    userArr = [];

btnShowModal.addEventListener('click', function () {
    modalWindow.classList.remove('modalWindowHide');
    modalWindow.classList.add('modalWindowShow');
    btnCreate.textContent = 'Create';
});
btnShowModal.addEventListener('click', function () {
    let optionNamesArr = ['Admin', 'User', 'Guest'];
    addRadioInput(optionNamesArr, modalWindow);

}, {once: true});


btnCreate.addEventListener('click', function () {
    let section = document.getElementById('select');
    if (isValidAge(userAge.value) && isValidEmail(userEmail.value) && isValidUserName(userLastName.value) && isValidUserName(userName.value)) {
        if (isEdit.ready) {
            let index = isEdit.indexOfUserToChange;
            userArr[index] = newUserObj(userName.value, userLastName.value, userEmail.value, userAge.value);
            userIdCount--;
            userArr[index].id = isEdit.currentId;
            sendRequest('POST', JSON.stringify(userArr[index]));
            let span = document.getElementsByClassName('personInfo' + isEdit.currentId)[0];
            span.textContent = userName.value;
            isEdit.ready = false;
            modalWindow.classList.remove('modalWindowShow');
            modalWindow.classList.add('modalWindowHide');
        } else {

            user = newUserObj(userName.value, userLastName.value, userEmail.value, userAge.value);
            if (section) {
                user.role = section.value;
                modalWindow.removeChild(section);
                userRole = section.value;
            }

            creteNewUser(document.getElementById('users'), user);
            userArr.push(user);
            let data = JSON.stringify(user);
            sendRequest('POST', data);
            modalWindow.classList.remove('modalWindowShow');
            modalWindow.classList.add('modalWindowHide');

        }
    }
});

usersDiv.addEventListener('click', function (event) {
    if (event.target.classList.contains('info')) {
        let id = {id: event.target.parentNode.id};
        sendRequest('POST', JSON.stringify(id));
    } else if (event.target.classList.contains('edit')) {
        if (userRole !== 'Guest') {
            if ((userArr[0].userRole === 'User' && userArr[event.target.parentNode.id - 1].id === userArr[0].id) || userRole === 'Admin') {
                modalWindow.classList.remove('modalWindowHide');
                modalWindow.classList.add('modalWindowShow');
                isEdit.ready = true;
                isEdit.currentId = userArr[event.target.parentNode.id - 1].id;
                isEdit.indexOfUserToChange = (event.target.parentNode.id - 1);
                btnCreate.textContent = 'Change';
            } else sendRequest('POST', JSON.stringify(userArr[event.target.parentNode.id - 1]));

        } else if (userRole === 'Guest') {
            sendRequest('POST', JSON.stringify(userArr[event.target.parentNode.id - 1]));
        }
    } else if (event.target.classList.contains('delete')) {
        if (userRole !== 'Guest') {
            let id = {id: event.target.parentNode.id};
            sendRequest('DELETE', JSON.stringify(id));
            usersDiv.removeChild(event.target.parentNode);
        } else sendRequest('DELETE', JSON.stringify({id: event.target.parentNode.id}));

    }

});

function sendRequest(method, data) {
    return new Promise(function(resolve, reject){
        let xhr = new XMLHttpRequest();
        xhr.open(method, 'http://localhost:3000/', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(data);
        xhr.onload = function () {
            if (JSON.parse(xhr.response).message) {
                alert(JSON.parse(xhr.response).message);
            } else if (JSON.parse(xhr.response).userName) {
                alert(
                    'Name: ' + JSON.parse(xhr.response).userName + '\n' +
                    'Second Name: ' + JSON.parse(xhr.response).userLastName + '\n' +
                    'Age: ' + JSON.parse(xhr.response).userAge + '\n' +
                    'Email: ' + JSON.parse(xhr.response).userEmail);
            } else console.log(JSON.parse(xhr.response));
        };
    });

}


function isValidUserName(name) {
    if (name.length === 0) {
        console.log('Неверное имя или фамилия');
        return false
    } else return name[0].match(/[A-Z]/g);
}

function isValidAge(age) {
    if (!(Number(age) > 0 && Number(age) < 125) && age.length > 0) {
        console.log('Неверный возраст');
    } else return true
}

function isValidEmail(userEmail) {
    let email = userEmail.slice(-8);

    email = !(email !== '@mail.ru' || userEmail[0] === '@' || userEmail.length === 0);
    if (!email) {
        console.log('Неверный email')
    }

    return email;
}

function addRadioInput(optionNamesArr, element) {
    let name = document.createElement('select');
    name.id = 'select';
    name.className = 'select';
    for (let i = 0; i < optionNamesArr.length; i++) {
        let option = document.createElement('option');
        option.textContent = optionNamesArr[i];
        name.appendChild(option);
    }
    element.appendChild(name);
}


/*        let currentId = userArr[event.target.parentNode.id - 1].id;
        userArr[event.target.parentNode.id - 1] = newUserObj(userName.value, userLastName.value, userEmail.value, userAge.value);
        userArr[event.target.parentNode.id - 1].id = currentId;

        request('POST', JSON.stringify(userArr[event.target.parentNode.id - 1]));*/