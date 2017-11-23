// Variable Declarations
var express =       require("express"),
    app =           express(),
    bodyParser =    require("body-parser"),
    mongoose =      require("mongoose"),
    flash =         require("connect-flash"),
    User =          require("./models/user"),
    passport =      require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride =require("method-override");
    
// Require Route JS Files
var commentRoutes =     require("./routes/comments"),
    campgroundRoutes =  require("./routes/campgrounds"),
    indexRoutes =       require("./routes/index");

// App Configuration
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/find_my_camp", {useMongoClient: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require("moment");

// Passport Configuration
app.use(require("express-session")({
    secret: "This is the secret for passport",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Local Variable Declarations
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


// App Listening
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Find My Camp server has started.");
});