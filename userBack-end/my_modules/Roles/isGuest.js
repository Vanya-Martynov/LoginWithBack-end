let getRoleFunction = require('./getRoleFunction');
let DB = require('../DB');

function isGuest(req, res, next) {
    if (getRoleFunction.role === 'Guest') {
        let count = 0;
        for (let key in req.body) {
            count++;
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].replace(/[<>'"!_]/g, '');
            }
        }

        // if clicked info
        if (count === 1) {
            console.log(req.body.id, getRoleFunction.userId);
            if (req.body.id === getRoleFunction.userId) {
                DB.getInfoFromDataBase(req);
                res.send(getRoleFunction.users[`${req.body.id}`]);
            } else res.send({ERROR_BACK: 'NOT_ENOUGH_RIGHTS'});

            // if clicked edit
        } else if (req.body.id <= getRoleFunction.userCount && getRoleFunction.userCount !== 0) {
            res.send({ERROR_BACK: 'NOT_ENOUGH_RIGHTS'});

            // if clicked create
        } else {
            getRoleFunction.userCount++;
            if (req.body.role) {
                getRoleFunction.userId = req.body.id;
            }
            DB.createAndAddConnection(req);
            getRoleFunction.users[`${getRoleFunction.userCount}`] = req.body;
        }
    } else next();
}

module.exports.isGuest = isGuest;