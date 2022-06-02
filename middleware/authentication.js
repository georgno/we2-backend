const config = require('config');
const jwt = require('jsonwebtoken');

function isAuthenticated(req, res, next) {
    if (typeof req.headers.authorization !== "undefined") {
        let token = req.headers.authorization.split(" ")[1];
        var privateKey = config.get('session.tokenKey');
        jwt.verify(token, privateKey, { algorithm: "HS256" }, (err, user) => {
            if (err) {
                res.status(500).json({error: "Couldn't create token: Authentication failed"});
                return;
            }
            return next();
        });
    } else {
        res.status(500).json({error: "Couldn't create token: Authentication failed" });
        return;
    }
}


module.exports = {
    isAuthenticated
}