var express = require("express");
var router = express.Router({
    mergeParams: true
});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");


//======================
//Comments routes
//======================

router.get("/new", middleware.isLoggedIn, function (req, res) {
    //Find campground by id
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {
                campground: campground
            });
        }
    });
});

router.post("/", middleware.isLoggedIn, function (req, res) {
    //Lookup campground using id
    //console.log(Campground.findById(req.params.id));
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            // console.log(req.body.comment);
            //Create new comment using input from user using comment object from new comments page
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    //Add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //Save comment
                    comment.save();
                    console.log(comment.author.username);
                    //connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    //Redirect to campground show page
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

//Edit comment route
router.get("/:comment_id/edit", middleware.checkCommentOwner, (req, res) => {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
        if (err) {
            res.redirect("back");
        } else {
            campid = req.params.id;
            res.render("comments/edit", {
                campgroundid: campid,
                comment: foundComment
            });
        }
    });
});

//Update comment Route
router.put("/:comment_id", middleware.checkCommentOwner, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (
        err,
        updatedComment
    ) {
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment successfully updated");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//Destroy comment route
router.delete("/:comment_id", middleware.checkCommentOwner, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment successfully deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;
