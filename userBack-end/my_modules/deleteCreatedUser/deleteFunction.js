let getRoleFunction = require('../Roles/getRoleFunction');
let DB = require('../DB');

function deleteCreatedUser(req, res, next) {
    if (getRoleFunction.role === 'Admin' || getRoleFunction.role === 'User') {
        DB.deleteFromDataBase(req);
        delete getRoleFunction.users[`${req.body.id}`];
        res.send(getRoleFunction.users);
        console.log(getRoleFunction.role);
    } else {
        console.log(getRoleFunction.role);
        res.send({ERROR_BACK: 'NOT_ENOUGH_RIGHTS'});
    }
}

module.exports.deleteCreatedUser = deleteCreatedUser;