const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const forumMessageSchema = mongoose.Schema({
    forumID : String,
    messageTitle : String,
    messageText : String,
    authorID : String
});

// https://stackoverflow.com/questions/19762430/make-all-fields-required-in-mongoose
function AllFieldsRequiredByDefault(schema) {
    for (var i in schema.paths) {
        var attribute = schema.paths[i]
        if (attribute.isRequired == undefined) {
            attribute.required(true);
        }
    }
}

AllFieldsRequiredByDefault(forumMessageSchema)

module.exports = mongoose.model("ForumMessage", forumMessageSchema);
