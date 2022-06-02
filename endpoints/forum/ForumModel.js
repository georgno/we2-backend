const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const forumSchema = mongoose.Schema({
    forumName : String,
    forumDescription : String,
    ownerID : String
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

AllFieldsRequiredByDefault(forumSchema)

module.exports = mongoose.model("Forum", forumSchema);
