var express = require("express");
var router = express.Router();
var Court = require("../models/court");
var middleware = require("../middleware");

var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);


router.get("/", function(req,res){
    var noMatch = null;
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Court.find({name: regex}, function(err, allCourts){
            if(err){
                console.log(err);
            } else {
                if(allCourts.length < 1){
                    noMatch = "No courts match your search, please try again"
                }
                res.render("courts/index", {courts:allCourts, page:"courts", noMatch : noMatch});
            }
    });
    } else {
    //GET ALL COURTS
        Court.find({}, function(err, allCourts){
            if(err){
                console.log(err);
            } else {
                res.render("courts/index", {courts:allCourts, page:"courts", noMatch:noMatch});
            }
    });
    }
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
  // get data from form and add to courts array
  var name = req.body.name;
  var image = req.body.image;
  var rating = req.body.rating;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  }
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newCourt = {name: name, image: image, rating: rating, description: desc, author:author, location: location, lat: lat, lng: lng};
    // Create a new court and save to DB
    Court.create(newCourt, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to courtss page
            console.log(newlyCreated);
            res.redirect("/courts");
        }
    });
  });
});

router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("courts/new");
});

//SHOW

router.get("/:id", function(req, res){
    Court.findById(req.params.id).populate("comments").exec(function(err, foundCourt){
        if(err || !foundCourt){
            req.flash("error", "Court not found")
            res.redirect("back")
        } else {
            console.log(foundCourt);
               res.render("courts/show", {court: foundCourt}); 
        }
    });
});

//EDIT ROUTE
router.get("/:id/edit", middleware.checkCourtOwnership, function(req, res) {
    Court.findById(req.params.id, function(err, foundCourt){
        res.render("courts/edit", {court : foundCourt});
    });            
});


//UPDATE ROUTE

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCourtOwnership, function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    req.body.court.lat = data[0].latitude;
    req.body.court.lng = data[0].longitude;
    req.body.court.location = data[0].formattedAddress;
    
    Court.findByIdAndUpdate(req.params.id, req.body.court, function(err, court){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/courts/" + court._id);
        }
    });
  });
});

//DESTROY ROUTE
router.delete("/:id", middleware.checkCourtOwnership, function(req, res){
    Court.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/courts");
        } else {
            req.flash("success", "You have deleted court" )
            res.redirect("/courts")
        }
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;