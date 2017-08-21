var express = require("express");
var request = require("request");
var app = express();

var URL_BASE = "http://www.omdbapi.com/?";
var URL_APIKEY = "&apikey=thewdb";

app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("search");
});

app.get("/results", function(req, res){
    var query = req.query.search;
    var url = URL_BASE + "s=" + query + URL_APIKEY;
    console.log(url);
    
    request(url, function(e, response, body){
        if(!e && (res.statusCode == 200)){
            var data = JSON.parse(body);
            var movies = [];
            
            data["Search"].forEach(function(movie){
                 movies.push(movie);
            });
            
            res.render("movie", {movies: movies});
            return;
        }
        
        res.send(data["Error"]);
        
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server started on port " + process.env.PORT); 
});