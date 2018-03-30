let expiredToken,
    role,
    users = {},
    userId,
    userCount = 0;

function isExpiredToken(req, res, next) {
    if (Date.now() > expiredToken) {
        res.send({ERROR_BACK: 'TOKEN_EXPIRED'})
    } else next()
}

function getRole(req, res, next) {
    middleFunc(req)
        .then(function () {
            next();
        })
        .catch(function () {
            next();
        });
}

function middleFunc(req) {
    return new Promise(function (res, rej) {
        if (req.body.role) {
            expiredToken = req.body.token + 100000;
            role = req.body.role;
            userId = req.body.id;
            console.log(userId);
            module.exports.userId = userId;
            module.exports.role = role;
            res();
        } else {
            rej();
        }
    })
}

module.exports.users = users;
module.exports.userCount = userCount;
module.exports.getRole = getRole;
module.exports.isExpiredToken = isExpiredToken;