const express = require("express");
const AuthService = require("./AuthenticationService.js");
const router = express.Router();

router.post("/" , (req, res) => {
  AuthService.authenticateUser(req.headers.authorization, (err, user) => {
    if (err) {
      res.status(401).json({ message: err });
    } else {
      AuthService.createJWT(user, (err, accessToken) => {
          if (err) {
            res.status(401).json({ message: err});
          } else {
            console.log(JSON.stringify(user))
            res.status(200).setHeader('Authorization', 'Bearer '+ accessToken).setHeader('isAdministrator', user.isAdministrator).json()
          }
      })
    }
  });
});

router.get("/user")

module.exports = router;
