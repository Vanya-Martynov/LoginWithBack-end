let mysql = require('promise-mysql');

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
            //console.log(result);
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
            //console.log(result);
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
            //console.log(result);
        });
        connection.end();
    })
}


module.exports.getInfoFromDataBase = getInfoFromDataBase;
module.exports.deleteFromDataBase = deleteFromDataBase;
module.exports.editDataBase = editDataBase;
module.exports.createAndAddConnection = createAndAddConnection;
