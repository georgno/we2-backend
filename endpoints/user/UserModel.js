const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
    userID: String,
    userName: String,
    password: {type: String, required: true, maxLength: 100},
    isAdministrator: Boolean,
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

AllFieldsRequiredByDefault(userSchema)

module.exports = mongoose.model("User", userSchema);
