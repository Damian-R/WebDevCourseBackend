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
            res.redirect("/campgrounds");
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

// EDIT - edit content of a campground
// show edit form
router.get("/:id/edit", checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(!err){
            res.render("campgrounds/edit", {campground: foundCampground});
        } else {
            console.log(err);
        }
    });
});

// update logic
router.put("/:id", checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.info, function(err, campground){
        if(!err){
            res.redirect("/campgrounds/" + req.params.id);
        } else {
            res.redirect("/" + req.params.id + "/edit");
            console.log("edit failed");
        }
    });
});

// DESTROY - delete a campground from the database
router.delete("/:id", checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err, campground){
         if(!err){
             res.redirect("/campgrounds");
         } else {
             res.redirect("/campgrounds/" + req.params.id);
         }
    });
});

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
        // $(".modal").modal("open");
    }
}

function checkCampgroundOwnership(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, campground){
            if(!err){
                if(campground.author.id.equals(req.user._id)){
                    return next();
                } else {
                    res.redirect("back");
                }
            } else {
                res.redirect("back");
            }
        });
    } else {
        res.redirect("back");
    }
}

module.exports = router;