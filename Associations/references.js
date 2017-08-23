var mongoose = require("mongoose");
var Post = require("./models/post");
var User = require("./models/user");
mongoose.connect("mongodb://localhost/blog_demo_2", {useMongoClient: true});

// Post.create({
//     title: "Bob's NEW post",
//     content: "Bob's NEW message"
// }, function(err, post){
//     if(!err){
//         User.findOne({email: "bob@gmail.com"}, function(err, user){
//             if(!err){
//                 user.posts.push(post);
//                 user.save(function(err, data){
//                     if(!err){
//                         console.log(data);
//                     } else {
//                         console.log(err);
//                     }
//                 });
//             } else {
//                 console.log(err);
//             }
//         });
//     } else {
//         console.log(err);
//     }
// });

// User.create({
//     email: "bob@gmail.com",
//     name: "Bob Bobby"
// });

User.findOne({email: "bob@gmail.com"}).populate("posts").exec(function(err, user){
    if(!err) {
        console.log(user);
    } else {
        console.log(err);
    }
});