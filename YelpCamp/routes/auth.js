var express = require("express"),
    router  = express.Router(),
    passport = require("passport"),
    User    = require("../models/user");

router.get("/", function(req, res){
    res.render("landing");
});
    
//REGISTER
router.get("/register", function(req, res){
    res.render("register");
});

//register logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(!err){
            passport.authenticate("local")(req, res, function(){
                console.log(user);
                res.redirect("/campgrounds");
            });
        } else {
            console.log(err);
            return res.render("register");
        }
    });
});

//LOG IN
router.get("/login", function(req, res){
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res){
});

//LOG OUT
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
});

module.exports = router;