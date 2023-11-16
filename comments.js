// Create web server
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Comment = require('./models/comment');
var Post = require('./models/post');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/comments');

// Enable CORS (http://enable-cors.org/server_expressjs.html)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors());

// Mount body-parser to parse POST data
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Serve static files
app.use(express.static('public'));

// API endpoint to get a specific post
app.get('/posts/:id', function(req, res, next) {
  Post.findById(req.params.id, function(err, post) {
    if (err) return next(err);
    if (!post) return next(new Error('Post not found'));
    res.json(post);
  });
});

// API endpoint to get all comments for a specific post
app.get('/posts/:id/comments', function(req, res, next) {
  Post.findById(req.params.id, function(err, post) {
    if (err) return next(err);
    if (!post) return next(new Error('Post not found'));
    res.json(post.comments);
  });
});

// API endpoint to add a comment to a specific post
app.post('/posts/:id/comments', function(req, res, next) {
  Post.findById(req.params.id, function(err, post) {
    if (err) return next(err);
    if (!post) return next(new Error('Post not found'));
    var comment = new Comment(req.body);
    post.comments.push(comment);
    post.save(function(err) {
      if (err) return next(err);
      res.json(comment);
    });
  });
});

// API endpoint to update a comment
app.put('/posts/:id/comments/:commentId', function(req, res, next) {
  Post.findById(req.params.id, function(err, post) {
    if (err) return next(err);
    if (!post) return next(new Error('Post not found'));
    var comment = post.comments.id(req.params.commentId);
    if (!comment) return next(new Error('Comment not found'));
    comment.body = req.body.body;
    post.save(function(err) {
      if (err) return next(err);
      res.json(comment);
    });
  });
});