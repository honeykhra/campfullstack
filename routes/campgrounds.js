var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/", function (req, res) {
  //Get all campgrounds from DB
  Campground.find({}, function (err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", {
        campgrounds: allCampgrounds,
        currentUser: req.user,
      });
    }
  });
});

router.post("/", middleware.isLoggedIn, function (req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username,
  };
  var newCampground = {
    name: name,
    image: image,
    description: description,
    author: author,
  };
  console.log(newCampground);
  //Create a new campground and save to db
  Campground.create(newCampground, function (err, newlycreated) {
    if (err) {
      console.log(err);
    } else {
      //Redirect back to campgrounds page
      res.redirect("/campgrounds");
    }
  });
});

router.get("/new", function (req, res) {
  res.render("campgrounds/new");
});

//Show info about campgrounds
router.get("/:id", function (req, res) {
  //Find campground with provided id
  Campground.findById(req.params.id)
    .populate("comments")
    .exec(function (err, foundCampground) {
      if (err) {
        console.log(err);
      } else {
        //Render show template with that campground
        res.render("campgrounds/show", {
          campground: foundCampground,
        });
      }
    });
});

//EDIT Campground Route
router.get("/:id/edit", middleware.checkCampgroundOwner, function (req, res) {
  Campground.findById(req.params.id, function (err, foundCampground) {
    res.render("campgrounds/edit", {
      campground: foundCampground,
    });
  });
});
//Update campground route
router.put("/:id", middleware.checkCampgroundOwner, (req, res) => {
  //Find and update the correct campground
  Campground.findByIdAndUpdate(
    req.params.id,
    req.body.campground,
    (err, updatedCampground) => {
      if (err) {
        console.log(err);
      } else {
        //Redirect to show page
        req.flash("success", "Camp successfully updated");
        res.redirect("/campgrounds/" + req.params.id);
      }
    }
  );
});

//Destroy campground route
router.delete("/:id", middleware.checkCampgroundOwner, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      req.flash("success", "Camp successfully deleted");
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;
