var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer");
    
mongoose.connect("mongodb://localhost/restful_blog_app", {useMongoClient: true});
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

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

app.get("/blogs/:id", function(req, res){
     Blog.findById(req.params.id, function(err, blog){
        if(!err){
            res.render("show", {blog, blog}); 
        } else {
            res.redirect("/blogs");
        }
     });
});

app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, blog){
        if(!err){
            res.render("edit", {blog: blog});
        } else {
            console.log("ERROR: " + err);
            res.redirect("/blogs");
        }
    });
});

app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(!err){
            res.redirect("/blogs/" + req.params.id);
        } else {
            res.redirect("/blogs");
        }
    })
});

app.post("/blogs", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err){
        if(!err){
            res.redirect("/blogs");
        } else {
            console.log("ERROR: " + err);
        }
    });
});

app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(!err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server started on port " + process.env.PORT); 
});