var express = require("express");
var app = express();

app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("home");
});

app.get("/fallinlovewith/:name", function(req, res){
    var thing = req.params.name;
    res.render("love", {thingVar: thing});
});

app.get("/posts", function(req, res){
    var posts = [
        {title: "Post 1", author: "Susan"},
        {title: "Post 2", author: "Not Susan"},
        {title: "Post 3", author: "Bob"},
        {title: "Post 4", author: "Not Bob"}
    ]
    
    res.render("posts", {posts: posts})
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server started on port " + process.env.PORT);
});