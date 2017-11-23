// Variable Declarations
var express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground"),
    middleware = require("../middleware"),
    geocoder = require("geocoder");

// Index Route - Show all campgrounds
router.get("/", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err) {
            console.log(err);
            req.flash("error", "Database error: Could not find campgrounds.");
            res.redirect("/");
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user, page: "campgrounds"});
        }
    });
});

// New Campground Route
router.get("/new", middleware.isLoggedIn, function(req, res) {
   res.render("campgrounds/new"); 
});

// Create Campground Route
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name,
        image = req.body.image,
        desc = req.body.description,
        price = req.body.price,
        author = {
            id: req.user._id,
            username: req.user.username
        };
    geocoder.geocode(req.body.location, function(err, data){
        if(err || !data.results[0]){
            req.flash("error", "Location data not found. Please try again");
            res.redirect("back");
        } else {
            var lat = data.results[0].geometry.location.lat;
            var lng = data.results[0].geometry.location.lng;
            var location = data.results[0].formatted_address;
            var newCampground = {name: name, image: image, description: desc, price: price, author: author, location: location, lat: lat, lng: lng};
            Campground.create(newCampground, function(err, newlyCreated){
                if(err){
                    req.flash("error", err.message);
                    res.redirect("back");
                } else {
                    req.flash("success", "Congratulations " + req.user.username + ", you successfully added " + newlyCreated.name);
                    res.redirect("/campgrounds");
                }
            });
        }
    });
});

// Show Campground Route
router.get("/:id", function(req, res){
   Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
      if(err || !foundCampground){
          req.flash("error", "Campground not found.");
          res.redirect("/campgrounds");
      } else {
          res.render("campgrounds/show", {campground: foundCampground});
      }
   });
});

// Edit Campground Route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            req.flash("error","Campground not found.");
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

// Update Campground Route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    geocoder.geocode(req.body.campground.location, function(err, data){
        if(err || !data.results[0]){
            req.flash("error", "Location data not found. Please try again");
            res.redirect("back");
        } else {
            var lat = data.results[0].geometry.location.lat;
            var lng = data.results[0].geometry.location.lng;
            var location = data.results[0].formatted_address;
            var newData = {
                name: req.body.campground.name,
                image: req.body.campground.image,
                description: req.body.campground.description,
                cost: req.body.campground.cost,
                location: location,
                lat: lat,
                lng: lng
            };
            Campground.findByIdAndUpdate(req.params.id, newData, function(err, updatedCampground){
                if(err){
                    req.flash("error", err.message);
                    res.redirect("back");
                } else {
                    req.flash("success", "Successfully updated " + updatedCampground.name);
                    res.redirect("/campgrounds/" + updatedCampground._id);
                }
            });
        }
    });
});

// Delete Confirmation Route
router.get("/:id/delete", function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
       if(err){
           req.flash("error", "Could not find campground. Please try again.");
           res.redirect("/campgrounds");
       } else {
           res.render("campgrounds/delete", {campground: foundCampground});
       }
    });
});

// Destroy Campground Route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err, foundCampground){
       if(err){
           req.flash("error", "Could not delete campground. Please try again.");
           res.redirect("/campgrounds");
       } else {
           req.flash("success", "Successfully deleted " + foundCampground.name);
           res.redirect("/campgrounds");
       }
   }); 
});

// Export Express Router
module.exports = router;