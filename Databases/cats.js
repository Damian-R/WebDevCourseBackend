var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/cat_app", {useMongoClient: true});

var catSchema = new mongoose.Schema({
    name: String,
    age: Number,
    temperament: String
});

var Cat = mongoose.model("Cat", catSchema);

// var george = new Cat({
//     name: "Mrs. Norris",
//     age: 7,
//     temperament: "evil"
// });

// george.save(function(err, cat){
//      if(!err){
//          console.log("We just saved a cat to the database");
//          console.log(cat);
//      } else {
//          console.log("Something went wrong");
//      }
// });

Cat.create({
    name: "Snowy",
    age: 15,
    temperament: "bland"
}, function(err, cat){
    if(!err){
        console.log(cat);
    } else {
        console.log(err);
    }
});

Cat.find({}, function(err, cats){
    if(!err){
        console.log("CATS:");
        console.log(cats);
    } else {
        console.log("Error");
        console.log(err);
    }
});
