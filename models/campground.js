// Campground Schema Setup
var mongoose = require("mongoose");
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    price: String,
    location: String,
    lat: Number,
    lng: Number,
    createdAt: {type: Date, default: Date.now},
    author: {
        id: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "User"
        },
        username: String
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

// Export Campground Model
module.exports = mongoose.model("Campground", campgroundSchema);