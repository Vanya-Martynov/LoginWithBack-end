let express = require('express');
let app = express();
let port = 3000;
let bodyParser = require('body-parser');
let multer = require('multer');
let upload = multer();
let mysql = require('promise-mysql');

//my_modules
let getRoleFunction = require('./my_modules/Roles/getRoleFunction');
let isAdmin = require('./my_modules/Roles/isAdmin');
let isGuest = require('./my_modules/Roles/isGuest');
let isUser = require('./my_modules/Roles/isUser');
let deleteUser = require('./my_modules/deleteCreatedUser/deleteFunction');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:63342');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    //res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.post('/', [getRoleFunction.getRole, getRoleFunction.isExpiredToken, isGuest.isGuest, isUser.isUser, isAdmin.isAdmin], function (req, res) {
    res.send({ERROR_BACK: 'ACCESS_DENIED'});
});

app.delete('/', [getRoleFunction.isExpiredToken, deleteUser.deleteCreatedUser], function (req, res) {
    res.send({ERROR_BACK: 'ACCESS_DENIED'});
});

app.listen(port, function () {
    console.log(`Example app listening on port ${port}!`);
});


















/*


let test = require('./my_modules/test');
console.log(test.x, test.addX(100));

function deleteAll() {
    mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'dfyz1999',
        port: 3306,
        database: 'users',

    }).then(function (connection) {
        connection.query(`DELETE FROM userinfo`, function (error, result, fields) {

        });
        connection.end();
    })
}





function hash(str) {
    let hash = 0;
    if (str.length === 0)
        return hash;
    for (let i = 0; i < str.length; i++) {
        let char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;

        // Convert to 32bit integer
        hash = hash & hash;
    }
    return hash;
}*/