//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

const mongoose = require("mongoose");
const { urlencoded } = require("body-parser");
mongoose.connect(/* Add MongoDB connection string here. */, {useNewUrlParser: true});
const postSchema = new mongoose.Schema({
  title: String,
  content: String
});
const Post = mongoose.model("Post", postSchema);

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", function(req, res){
  Post.find({}, function(err, posts){
    res.render("home", {
      posts: posts
      });
    }
  )
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save(function(err){
    if(!err){
      res.redirect("/");
    }
  })
  });


app.get("/posts/:postId", function(req, res){
  const requestedPostId = req.params.postId;
  Post.findById(requestedPostId, function(err, post){     // find() does not work!!
    if(!err){
      res.render("post", {
        title: post.title,
        content: post.content,
        postID: post._id
      });
    };
  });
});

app.post("/delete/:postID", function(req, res){
  const postId = req.params.postID;
  Post.findByIdAndRemove(postId, function(err, post){
    if(!err){
      res.redirect("/");
    }
    else{
      console.log(err);
    }

  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
