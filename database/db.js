var mongoose = require("mongoose");
const config = require("config");
const fs = require("fs");
const UserService = require("../endpoints/user/UserService.js");

let _db;
const connectionString = config.get("db.connectionString");


function initDB(callback) {
  if (_db) {
    if (callback) {
      return callback(null, _db);
    } else {
      return _db;
    }
  } else {
    mongoose.connect(connectionString);
    _db = mongoose.connection;

    _db.on("error", console.error.bind(console, "connection error:"));
    _db.once("open", function () {
      console.log("Connected to database " + connectionString + " in DB.js: ");

      // creating default users
      const path = ".deploy/users.json";
      fs.readFile(path, "utf8", (err, data) => {
        if (err) return console.error(err);
        const usersConf = JSON.parse(data);
        var user = usersConf.users[0];
        console.log("creating default user");
        UserService.createUser(
          user.userID,
          user.userName,
          user.isAdministrator,
          user.password, (err, user) => {
            if(err) { 
                console.log(err)
            } else {
                console.log(user)
            }
          }
        )
      });

      callback(null, _db);
    });
  }
}

function getDb() {
  return _db;
}

module.exports = {
  getDb,
  initDB,
};
