var express = require("express");
var app = express();

app.get("/", function(req, res){
   res.send("Welcome to the assignment"); 
});

app.get("/speak/:animal", function(req, res){
    var animal = req.params.animal.toLowerCase();
    var sound = {
        pig: "oink",
        cow: "moo",
        dog: "woof"
    };
   
   res.send("The " + animal + " says " + sound[animal]);
});

app.get("/repeat/:str/:num", function(req, res){
    var str = "";
    for(var i = 0; i < req.params.num; i++){
        str += req.params.str + " ";
    }
    res.send(str);
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("server started on port " + process.env.PORT); 
});