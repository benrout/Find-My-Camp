// Variable Declarations
var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    Campground = require("../models/campground"),
    User = require("../models/user");

// Root Route - Landing Page
router.get("/", function(req, res){
    res.render("landing");
});

// Register Form Route
router.get("/register", function(req, res) {
    res.render("register", {page: "register"});
});

// Register Post Route
router.post("/register", function(req, res) {
    var newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        avatar: req.body.avatar
    });
    if(req.body.adminCode === "adm1npl3as3!"){
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Successfully signed up. Welcome to Find My Camp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// Login Form Route
router.get("/login", function(req, res) {
    res.render("login", {page: "login"});
});

// Login Post Route
router.post("/login", passport.authenticate("local", {
        successRedirect:"/campgrounds",
        failureRedirect:"/login",
        failureFlash: true,
        successFlash: "Successfully logged you in."
    })
);

// Logout Route
router.get("/logout", function(req, res) {
   req.logout();
   req.flash("success", "Successfully logged you out.");
   res.redirect("/campgrounds");
});

// User Profile Route
router.get("/users/:id", function(req, res) {
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            req.flash("error", "User not found.");
            res.redirect("/campgrounds");
        }
        Campground.find().where("author.id").equals(foundUser.id).exec(function(err, campgrounds){
            if(err){
                res.redirect("back");
            }
            res.render("users/show", {user: foundUser, campgrounds: campgrounds});
        });
    });
});

// Export Express Router
module.exports = router;