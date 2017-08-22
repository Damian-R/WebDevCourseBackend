var express     = require("express"),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    app     = express();
    
mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true});

// SCHEMA SETUP
var campSchema = mongoose.Schema({
     name: String,
     image: String,
     desc: String
});

var Campground = mongoose.model("Campground", campSchema);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(!err){
            res.render("index", {campgrounds: allCampgrounds});
        } else {
            console.log("ERROR");
            console.log(err);
        }
    }); 
});

app.get("/campgrounds/new", function(req, res){
    res.render("new.ejs");
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
    console.log(req.params.id);
    Campground.findById(req.params.id, function(err, foundCampground){
        if(!err){
            res.render("show", {campground: foundCampground});
        } else {
            console.log("ERROR: " + err);
        }
    });
    //find campground with provided id
    //render show template with that campground
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started on port " + process.env.PORT);
});