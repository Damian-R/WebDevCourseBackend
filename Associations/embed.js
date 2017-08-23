var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/blog_demo");

//USER
var userSchema = mongoose.Schema({
    email: String,
    name: String
});

var User = mongoose.model("User", userSchema);

//POST