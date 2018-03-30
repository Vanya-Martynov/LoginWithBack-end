let getRoleFunction = require('./getRoleFunction');
let DB = require('../DB');

function isAdmin(req, res, next) {
    if (getRoleFunction.role === 'Admin') {
        let count = 0;
        for (let key in req.body) {
            count++;
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].replace(/[<>'"!_]/g, '');
            }
        }

            // if clicked info
        if (count === 1) {
            DB.getInfoFromDataBase(req);
            res.send(getRoleFunction.users[`${req.body.id}`]);

            // if clicked edit
        } else if (req.body.id <= getRoleFunction.userCount && getRoleFunction.userCount !== 0) {
            DB.editDataBase(req);
            for (let key in getRoleFunction.users[`${req.body.id}`]) {
                getRoleFunction.users[`${req.body.id}`][key] = req.body[key];
            }
            res.send(getRoleFunction.users[`${req.body.id}`]);

            // if clicked create
        } else {
            DB.createAndAddConnection(req);
            getRoleFunction.userCount++;
            getRoleFunction.users[`${getRoleFunction.userCount}`] = req.body;
        }
    } else next();
}

module.exports.isAdmin = isAdmin;