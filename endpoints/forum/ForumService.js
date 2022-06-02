const express = require("express");
const app = express.Router();
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Forum = require("./ForumModel.js");

// CREATE

async function createForum(headers, body, callback) {
  const usertoken = headers.authorization;
  let userID;
  const token = usertoken.split(" ");
  const decoded = jwt.verify(
    token[1],
    config.get("session.tokenKey"),
    (err, decoded) => {
      userID = decoded.userID;
    }
  );
  var name = body.forumName;
  var cforum = await Forum.findOne({ forumName: name });
  if (cforum !== null) {
    callback("Forum already exists", cforum);
  } else {
    const forum = new Forum({
      forumName: name,
      forumDescription: body.forumDescription,
      ownerID: userID,
    });
    forum.save();
    callback(null, forum);
  }
}

// READ

async function getForums(callback) {
  Forum.find(function (err, forums) {
    if (err) {
      console.log("Searcherror:" + err);
      return callback(err, null);
    } else {
      console.log("forums found");
      return callback(null, forums);
    }
  });
}

async function getForumsByUserID(body, callback) {
  Forum.find({ownerID : body.ownerID }, function (err, forums) {
    if (err == null ) {
      console.log("no forums found");
      return callback("nothing found", null);
    } else {
      console.log("Forums found");
      return callback(null, forums);
    }
  });
}

async function getOwnForums(body, callback) {
  var id = body.forumID;
  const forum = await Forum.findOne({ forumID: id });
  if (forum) {
    callback(null, forum);
    console.log("Forum found")
  } else {
    callback("Forum doesn't exist yet", null);
    console.log("Forum doesn't exist yet");
  }
}

// UPDATE

async function updateForum(newData, callback) {
  var id = newData.userID;
  console.log(newData);
  delete newData["_id"];
  if (Forum.exists({ forumID: id })) {
    Forum.findOneAndUpdate(
      { forumID: id },
      newData,
      { returnDocument: "after" },
      (err, doc) => {
        if (err) {
          console.log("Something's wrong when updating data!");
          console.log(doc);
          callback(err, null);
        } else {
          callback(null, doc);
        }
      }
    );
  } else {
    callback("forum doesn't exist", null);
  }
}

// DELETE

async function deleteForum(body, callback) {
  var id = body._id;
  try {
    const forum = await Forum.findOne({ _id: id });
    if (!forum) callback(null, forum);
    await Forum.deleteOne({ _id: id });
    callback("Forum deleted", forum);
  } catch(error) {
    return null;
  }

}

module.exports = {
  createForum,
  getForums,
  getForumsByUserID,
  getOwnForums,
  updateForum,
  deleteForum,
};
