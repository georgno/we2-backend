const express = require("express");
const app = express.Router();
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Forum = require("../forum/ForumModel.js");
const ForumMessage = require("./ForumMessageModel.js");

// CREATE

async function createForumMessage(headers, body, callback) {
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

  var fid = body.forumID;
  var title = body.messageTitle;
  var text = body.messageText;
  var forum = await Forum.findOne({ _id: fid });
  if (forum == null) {
    callback("Forum not found");
  } else {
    const message = new ForumMessage({
      forumID: fid,
      messageTitle: title,
      messageText: text,
      authorID: userID,
    });
    message.save();
    callback(null, message);
  }
}

// READ

async function getForumMessages(callback) {
  ForumMessage.find(function (err, forummessages) {
    if (err) {
      console.log("Searcherror:" + err);
      return callback(err, null);
    } else {
      console.log("forummessages found");
      return callback(null, forummessages);
    }
  });
}

async function getForumMessagesByForumID(body, callback) {
  let forumID = body.forumID;
  ForumMessage.find({ forumID: forumID }, function (err, messages) {
		if (messages === null) return callback(err, []);
		if (messages.length === 0) return callback(err, []);
		callback(null, messages);
    }
  );
}

async function getForumMessagesByAuthorID(body, callback) {
  let authorID = body.authorID;
  ForumMessage.find({ authorID: authorID }, function (err, messages) {
			if (messages === null) return callback(err, []);
			if (messages.length === 0) return callback(err, []);
			callback(null, messages);
		}
	);
}

// UPDATE

async function updateForumMessage(newData, callback) {
  var id = newData._id;
  console.log(newData);
  delete newData["_id"];
  ForumMessage.findOneAndUpdate(
    { _id: id },
    newData,
    { returnDocument: "after" },
    (err, doc) => {
      if (err) return callback(err, null);
      if (doc === null) return callback("error whilst searching message", null);
      if (doc.length === 0) return callback("no message found", null);
      return callback(null, doc);
    }
  );
}

// DELETE

async function deleteForumMessage(body, callback) {
  var id = body._id;
  try {
    const forumMessage = await ForumMessage.findOne({ _id: id });
    if (!forumMessage) callback(null, forumMessage);
    await ForumMessage.deleteOne({ _id: id });
    callback("forumMessage deleted", forumMessage);
  } catch (error) {
    return null;
  }
}

module.exports = {
  createForumMessage,
  getForumMessages,
  getForumMessagesByForumID,
  getForumMessagesByAuthorID,
  updateForumMessage,
  deleteForumMessage,
};
