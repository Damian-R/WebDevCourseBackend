var bodyParser  = require("body-parser"),
    Campground  = require("./models/campground"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    Comment     = require("./models/comment"),
    express     = require("express"),
    mongoose    = require("mongoose"),
    seedDB      = require("./seeds"),
    User        =require("./models/user"),
    app         = express();

mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true});

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

seedDB();

// passport config
app.use(require("express-session")({
    secret: "anything",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(!err){
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        } else {
            console.log("ERROR");
            console.log(err);
        }
    }); 
});

app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new");
});

app.post("/campgrounds", function(req, res){
    var name = req.body.name;
    var imageURL = req.body.imageURL;
    var desc = req.body.desc;
    var newCampground = {name: name, image: imageURL, desc: desc};
    Campground.create(newCampground, function(err, campground){
        if(!err){
            res.redirect("/campgrounds");
        } else {
            console.log("ERROR: " + err);
        }
    })
});

// SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
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

//COMMENT ROUTES
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
         if(!err){
             res.render("comments/new", {campground: campground});
         } else {
             console.log(err);
         }
    });
});

app.post("/campgrounds/:id/comments", function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(!err){
            Comment.create(req.body.comment, function(err, comment){
                if(!err){
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

// AUTH ROUTES

//REGISTER
app.get("/register", function(req, res){
    res.render("register");
});

//register logic
app.post("/register", function(req, res){
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
app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res){
});

//LOG OUT
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started on port " + process.env.PORT);
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
    }
}