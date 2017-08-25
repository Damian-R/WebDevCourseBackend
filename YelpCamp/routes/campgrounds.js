var express = require("express"),
    Campground = require("../models/campground"),
    router = express.Router();

router.get("/", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(!err){
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        } else {
            console.log("ERROR");
            console.log(err);
        }
    }); 
});

router.get("/new", isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

router.post("/", isLoggedIn, function(req, res){
    var name = req.body.name;
    var imageURL = req.body.imageURL;
    var desc = req.body.desc;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: imageURL, desc: desc, author: author};
    Campground.create(newCampground, function(err, campground){
        if(!err){
            console.log(campground);
            res.redirect("/");
        } else {
            console.log("ERROR: " + err);
        }
    })
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(!err){
            res.render("campgrounds/show", {campground: foundCampground});
        } else {
            console.log("ERROR: " + err);
        }
    });
    //find campground with provided id
    //render show template with that campground
});

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
    }
}

module.exports = router;