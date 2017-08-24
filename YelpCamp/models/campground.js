var mongoose = require("mongoose");

// SCHEMA SETUP
var campSchema = mongoose.Schema({
     name: String,
     image: String,
     desc: String,
     comments: [
         {
             type: mongoose.Schema.Types.ObjectId,
             ref: "Comment"
         }
    ]
});

module.exports = mongoose.model("Campground", campSchema);
