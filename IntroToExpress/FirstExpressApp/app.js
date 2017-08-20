var express = require("express");

var app = express();

app.get("/", function(req, res){
    res.send("Hello");
});

app.get("/bye", function(req, res){
    res.send("Goodbye");
});

app.get("/dog", function(req, res){
    res.send("woof"); 
});

app.get("/r/:subredditName", function(req, res){
    var subreddit = req.params.subredditName;
    res.send("welcome to the " + subreddit + " subreddit"); 
});

app.get("*", function(req, res){
    res.send("catch-all route reached."); 
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server started on port " + process.env.PORT); 
});