let express = require('express');
let app = express();
let port = 3000;
let bodyParser = require('body-parser');
let multer = require('multer');
let upload = multer();
let mysql = require('promise-mysql');

let users = {},
    userCount = 0;

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


let role,
    userId;

function getRole(req, res, next) {
    middleFunc(req)
        .then(function () {
            next()
        })
        .catch(function () {

            next();
        });
}

function isAdmin(req, res, next) {
    if (role === 'Admin') {
        let count = 0;
        for (let key in req.body) {
            count++;
            req.body[key] = req.body[key].replace(/[<>'"!_]/g, '');
        }

        // if clicked info
        if (count === 1) {
            getInfoFromDataBase(req);
            res.send(users[`${req.body.id}`]);
            // if clicked edit
        } else if (req.body.id <= userCount && userCount !== 0) {
            editDataBase(req);
            for (let key in users[`${req.body.id}`]) {
                users[`${req.body.id}`][key] = req.body[key];
            }
            res.send(users[`${req.body.id}`]);

            // if clicked create
        } else {
            createAndAddConnection(req);
            userCount++;
            users[`${userCount}`] = req.body;
        }
    }else next();
}

function isUser(req, res, next) {
    if (role === 'User') {
        let count = 0;
        for (let key in req.body) {
            count++;
            req.body[key] = req.body[key].replace(/[<>'"!_]/g, '');
        }

        // if clicked info
        if (count === 1) {
            if (req.body.id === userId) {
                getInfoFromDataBase(req);
                res.send(users[`${req.body.id}`]);
            } else res.send({message: 'You are User, u can only watch Info of your profile, Delete and Edit'})

            // if clicked edit
        } else if (req.body.id <= userCount && userCount !== 0) {
            editDataBase(req);
            for (let key in users[`${req.body.id}`]) {
                users[`${req.body.id}`][key] = req.body[key];
            }
            res.send(users[`${req.body.id}`]);

            // if clicked create
        } else {
            createAndAddConnection(req);
            userCount++;
            users[`${userCount}`] = req.body;
        }
    }else next();
}

function isGuest(req, res, next) {
    if (role === 'Guest') {

        let count = 0;
        for (let key in req.body) {
            count++;
            req.body[key] = req.body[key].replace(/[<>'"!_]/g, '');
        }

        // if clicked info
        if (count === 1) {
            if (req.body.id === userId) {
                getInfoFromDataBase(req);
                res.send(users[`${req.body.id}`]);
            } else res.send({message: 'You are Guest, u can only create new user and watch Info of your profile'});

            // if clicked edit
        } else if (req.body.id <= userCount && userCount !== 0) {
            res.send({message: 'You are Guest, u can only create new user and watch Info of your profile'});

            // if clicked create
        } else {
            createAndAddConnection(req);
            userCount++;
            users[`${userCount}`] = req.body;
        }
    }else next();
}


function middleFunc(req) {
    return new Promise(function (res, rej) {
        if (req.body.role) {
            role = req.body.role;
            userId = req.body.id;
            post = req.body;
            res();
        } else {
            rej();
        }
    })
}

app.get('/', function (req, response) {
    response.send(client);
});

app.post('/', [getRole, isGuest, isUser, isAdmin], function (req, res) {
    res.send({message: 'Unknown situation'});
});

app.delete('/', function (req, res) {
    if (role === 'Admin' || role === 'User') {
        deleteFromDataBase(req);
        delete users[`${req.body.id}`];
        res.send(users);
    } else res.send({message: 'You don\'t have enough rights'});

});


app.listen(port, function () {
    console.log(`Example app listening on port ${port}!`);
});


function createAndAddConnection(req) {
    mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'dfyz1999',
        port: 3306,
        database: 'users',

    }).then(function (connection) {
        connection.query(
            'INSERT INTO userinfo SET ?',
            {
                userEmail: req.body.userEmail,
                userLastName: req.body.userLastName,
                userName: req.body.userName,
                userAge: req.body.userAge,
                frontUserId: req.body.id,
            }, function (err, result) {
                if (err) console.log('Error: ' + err);
                //console.log(connection)
            }
        );
        connection.query('SELECT iduserInfo FROM userinfo ORDER BY iduserInfo DESC LIMIT 1', function (error, result, fields) {
            console.log(result);
        });
        connection.end();
    })
}

function editDataBase(req) {
    mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'dfyz1999',
        port: 3306,
        database: 'users',

    }).then(function (connection) {
        connection.query(
            `UPDATE userinfo
             SET 
                userName = '${req.body.userName}',
                userLastName = '${req.body.userLastName}',
                userAge = '${req.body.userAge}',
                userEmail = '${req.body.userEmail}'
            WHERE frontUserId = ${req.body.id}`, function (err, result) {
                if (err) {
                    console.log('Error: ' + err);
                    console.log(req.body.id);
                }
            }
        );
        connection.query('SELECT * FROM userinfo', function (error, result, fields) {
            console.log(result);
        });

        connection.end();
    })
}

function deleteFromDataBase(req) {
    mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'dfyz1999',
        port: 3306,
        database: 'users',

    }).then(function (connection) {
        connection.query(
            `DELETE FROM userinfo
             WHERE frontUserId = ${req.body.id}`, function (err, result) {
                if (err) {
                    console.log(err);
                }
            }
        );
        connection.end();
    })
}

function getInfoFromDataBase(req, info) {
    mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'dfyz1999',
        port: 3306,
        database: 'users',

    }).then(function (connection) {
        connection.query(`SELECT * FROM userinfo WHERE frontUserId = ${req.body.id}`, function (error, result, fields) {
            info = result[result.length - 1];
            console.log(result);
        });
        connection.end();
    })
}



