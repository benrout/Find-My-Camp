// User Schema Setup
var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var UserSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    password: String,
    firstName: String,
    lastName: String,
    email: {type: String, unique: true, required: true},
    isAdmin: {type: Boolean, default: false}
});

UserSchema.plugin(passportLocalMongoose);

// Export User Model
module.exports = mongoose.model("User", UserSchema);