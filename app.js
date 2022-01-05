var express = require("express");
var app = express();
var bodyparser = require("body-parser");
const mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var flash = require("connect-flash");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");

var commentRoutes = require("./routes/comments"),
  campgroundRoutes = require("./routes/campgrounds"),
  indexRoutes = require("./routes/index");

//seedDB();//Seed the database with campgrounds and comments
// mongoose.connect("mongodb://localhost/Yelp_camp_v12", {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false,
// });
mongoose.connect(
  "mongodb+srv://honey:divu12345@cluster0-ujnag.gcp.mongodb.net/test?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }
);
//mongodb+srv://honey:divu12345@cluster0-ujnag.gcp.mongodb.net/test?retryWrites=true&w=majority
app.set("view engine", "ejs");
app.use(
  bodyparser.urlencoded({
    extended: true,
  })
);
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//console.log(__dirname);

// Campground.create(
//   {
//     name: "Shimla",
//     image:
//       "https://images.unsplash.com/photo-1487730116645-74489c95b41b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
//   },
//   function(err, campground) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("Newly Created Campground");
//       console.log(campground);
//     }
//   }
// );

//PASSPORT CONFIGURATION
app.use(
  require("express-session")({
    secret: "Reetu is sweet",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Local things that can be used anywhere to access data
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT || 3000, function () {
  console.log("The YelpCamp Server has started");
});
