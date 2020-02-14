var express = require('express');
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var User = require("../models/user");
var passport = require("passport");


router.get("/", function (req, res) {
    res.render("landing.ejs");
});


//=======================
//AUTH ROUTES
//=======================

//Show Register Form
router.get("/register", function (req, res) {
    res.render("register");
});

//Handle sign up logic
router.post("/register", function (req, res) {
    var newUser = new User({
        username: req.body.username
    });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            req.flash("error", err.message);
            console.log(err);
            res.redirect("register");
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

//Show login form
router.get("/login", (req, res) => {
    res.render("login");
});
//Handle login logic
router.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }),
    (req, res) => {}
);
//Logout route
router.get("/logout", (req, res) => {
    req.logOut();
    req.flash("success", "Logged you out");
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please login to continue");
    res.redirect("/login");
}


module.exports = router;