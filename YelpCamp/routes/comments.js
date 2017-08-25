var express     = require("express"),
    Campground  = require("../models/campground"),
    Comment     = require("../models/comment"),
    router      = express.Router({mergeParams: true});

//new comment route
router.get("/new", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
         if(!err){
             res.render("comments/new", {campground: campground});
         } else {
             console.log(err);
         }
    });
});

//create comment route
router.post("/", function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(!err){
            Comment.create(req.body.comment, function(err, comment){
                if(!err){
                    
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                } else {
                    console.log(err);
                }
            });
        } else {
            console.log(err);
        }
    });
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