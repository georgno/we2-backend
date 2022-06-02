const express = require("express");
const app = express.Router();
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const User = require("./UserModel.js");

// CREATE

async function createUser(id, userName, isAdmin, password, callback) {
  var adminStatus = false;
  var cuser = await User.findOne({ userID: id });
  if (cuser !== null) {
    callback("User already exists", cuser);
  } else {
    var hash = await hashPassword(password);
    const user = new User({
      userID: id,
      userName: userName,
      password: hash,
      isAdministrator: isAdmin,
    });
    user.save();
    callback(null, user);
  }
}

// READ

async function getUsers(callback) {
  User.find(function (err, users) {
    if (err) {
      console.log("Searcherror:" + err);
      return callback(err, null);
    } else {
      console.log("Users found");
      return callback(null, users);
    }
  });
}

async function getUser(id, callback) {
  const user = await User.findOne({ userID: id });
  if (user) {
    callback(null, user);
  } else {
    callback("User doesn't exist yet", null);
  }
}

// UPDATE

async function updateUser(newData, callback) {
  console.log(newData)
  if (newData.hasOwnProperty("password")) {
    newData.password = await hashPassword(newData.password);
  }
  var id = newData.userID;
  User.exists({ userID:id }, function (err, result) {
    if (err) {
      callback(err, null);
    } else {
      const update = newData;

      User.findOneAndUpdate(
        { userID: id },
        update,
        { returnDocument: "after" },
        (err, doc) => {
          if (err) {
            console.log("Something wrong when updating data!");
            callback(err, null);
          } else {
            callback(null, doc);
          }
        }
      );
    }
  })
}

// DELETE

async function deleteUser(id, callback) {
  const user = await User.findOne({ userID: id });
  if (user) {
    await User.deleteOne({ userID: id });
    callback("User deleted", user);
  } else {
    callback(null, user);
  }
}

async function hashPassword(password) {
  return new Promise((resolve, reject) => {
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });
}

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
