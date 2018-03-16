let express = require('express');
let app = express();
let port = 3000;
let bodyParser = require('body-parser');
let multer = require('multer');
let upload = multer();

let users = {},
    userCount = 0;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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

function middleFunc(req) {
    return new Promise(function(res, rej){
        if(req.body.role){
            role = req.body.role;
            userId = req.body.id;

            res();
        }else{
            rej();
        }
    })
}

app.get('/', function (req, response) {
    response.send(users);
});

app.post('/',[getRole], function (req, res) {

    if(role === 'Admin'){
        let count = 0;
        for(let key in req.body){
            count++;
            req.body[key] = req.body[key].replace(/[<>'"!_]/g, ''); //back-end validation
        }
        if(count === 1){ // if clicked info
            res.send(users[`${req.body.id}`]);
        }else if(req.body.id <= userCount && userCount !== 0){ // if clicked edit

            for(let key in users[`${req.body.id}`]){
                users[`${req.body.id}`][key] = req.body[key];
            }
            res.send(users[`${req.body.id}`]);
        }else{ // if clicked create
            userCount++;
            users[`${userCount}`] = req.body;
           // res.send({message: 'successfully created'});
        }
    }
    else if(role === 'User'){
        let count = 0;
        for(let key in req.body){
            count++;
            req.body[key] = req.body[key].replace(/[<>'"!_]/g, ''); //back-end validation
        }
        if(count === 1){ // if clicked info
            res.send(users[`${req.body.id}`]);
        }else if(req.body.id <= userCount && userCount !== 0){ // if clicked edit
            if(req.body.id === userId){
                for(let key in users[`${req.body.id}`]){
                    users[`${req.body.id}`][key] = req.body[key];
                }
                res.send(users[`${req.body.id}`]);
            }else res.send({message: 'Sorry but you can\'t'})
        }else{ // if clicked create
            userCount++;
            users[`${userCount}`] = req.body;
        }
    }
    else if(role === 'Guest'){

        let count = 0;
        for(let key in req.body){
            count++;
            req.body[key] = req.body[key].replace(/[<>'"!_]/g, ''); //back-end validation
        }
        if(count === 1){ // if clicked info
            if(req.body.id === userId){
                res.send(users[`${req.body.id}`]);
            }else res.send({message :'You are Guest, u can only create new user and watch Info of your profile'});
        }else if(req.body.id <= userCount && userCount !== 0){ // if clicked edit
            res.send({message :'You are Guest, u can only create new user and watch Info of your profile'});
        }else{ // if clicked create
            userCount++;
            users[`${userCount}`] = req.body;
        }
    }

});

app.delete('/', function (req, res) {
    if(role === 'Admin' || role === 'User'){
        delete users[`${req.body.id}`];
        res.send(users);
    }else res.send({message: 'You don\'t have enough rights'});

});


app.listen(port, function () {
    console.log(`Example app listening on port ${port}!`);
});
