const express = require("express");
const UserService = require("./UserService.js");
const router = express.Router();
const auth = require("../../middleware/authentication.js");

router.get("/", auth.isAuthenticated, (req, res) => {
  UserService.getUsers(function (err, users) {
    if (users) {
      res.status(200).json(users);
    } else {
      res.status(404).send("Problems retrieving users");
    }
  });
});

router.post("/", async (req, res) => {
    let adminStatus = false;
    if (req.body.isAdministrator != null) adminStatus = req.body.isAdministrator;
    UserService.createUser(
      req.body.userID,
      req.body.userName,
      adminStatus,
      req.body.password,
      function (err, user) {
        if (err) {
          res.status(404).json(user);
          console.log(err);
        } else {
          res.status(200).json(user);
          console.log("User created");
        }
      }
    );
  });

router.put("/", async (req, res) => {
  UserService.updateUser(req.body, (err, user) => {
    if (err) {
      res.status(404).json(err);
      console.log(err);
    } else {
      res.status(200).json(user);
      console.log("User updated");
    }
  });
});

router.post("/getByUserID", (req, res) => {
  UserService.getUser(req.body.userID, (err, user) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).json(user);
    }
  });
});

router.delete("/", async (req, res) => {
  UserService.deleteUser(req.body.userID, (err, user) => {
    if (err) {
      res.status(200).json(user);
      console.log(err);
    } else {
      res.status(404).json("User doesn't exist");
      console.log("User not deleted. User doesn't exist");
    }
  });
});

module.exports = router;
