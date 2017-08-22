var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");
    
mongoose.connect("mongodb://localhost/restful_blog_app", {useMongoClient: true});
app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

// MONGOOSE MODEL/SCHEMA CONFIG
var blogSchema = mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// ROUTES

app.get("/", function(req, res){
    res.redirect("/blogs"); 
});

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(!err){
            blogs.forEach(function(blog){
                console.log(blog);
            })
            
            res.render("index", {blogs, blogs});
        } else {
            console.log("ERROR: " + err);
        }
    });
});

app.get("/blogs/new", function(req, res){
    res.render("new");
});

app.post("/blogs", function(req, res){
    Blog.create(req.body.blog, function(err){
        if(!err){
            res.redirect("/blogs");
        } else {
            console.log("ERROR: " + err);
        }
    });
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server started on port " + process.env.PORT); 
});