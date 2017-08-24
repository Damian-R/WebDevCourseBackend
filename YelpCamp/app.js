var bodyParser  = require("body-parser"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    express     = require("express"),
    mongoose    = require("mongoose"),
    seedDB      = require("./seeds"),
    app         = express();

mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true});

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

seedDB();

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
app.get("/campgrounds/:id/comments/new", function(req, res){
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

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started on port " + process.env.PORT);
});