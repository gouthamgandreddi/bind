const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Post = require('./models/post');

const app = express();

mongoose.connect("mongodb+srv://gouthamase:gouthamase@cluster0-5zsye.mongodb.net/model?retryWrites=true",
  { useNewUrlParser: true })
  .then(()=>{
    console.log('connected succesfully');
  })
  .catch(()=>{
    console.log('error in connection');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req,res,next) =>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers',
    'Origin,X-Requested-With,Content-Type,Accept');
  res.setHeader('Access-Control-Allow-Methods',
    'GET,POST,PATCH,DELETE,OPTIONS');
  next();
});

app.post("/api/posts",(req,res,next)=>{
  const post = new Post({
  title:req.body.title,
  content:req.body.content
  });
  post.save();
  console.log(post);
  res.status(201).json({
    message:'posts added'
  });
});

app.get('/api/posts',(req,res,next)=>{

  const posts = [
    {
      id: 'ghjkf',
      title:'Harry Potter',
      content:'Whizards'
    },
    {
      id: 'qwert',
      title:'Harry Potter Deathly hallows',
      content:'Whizards end'
    }
    ];
  res.status(200).json({
    message:'response from server',
    posts:posts
  });
});

module.exports = app;
