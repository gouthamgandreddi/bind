const express = require('express');
const multer = require("multer");  //multer needs configuration
const Post = require('../models/post');

const MIME_TYPE_MAP ={
  'image/png':'png',
  'image/jpeg':'jpg',
  'image/jpg':'jpg'
};

const router = express.Router();

//need to give where multer should put files which it detects in incoming request
const storage = multer.diskStorage({
  destination: (req,file,cb ) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error =new Error("Invalid mime type");
    if (isValid){
      error = null;
    }
    cb(null,"backend/images") //path relative to server.js
  },
  filename: (req,file,cb) =>{
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null,name+'-'+Date.now()+'.'+ext);
  }
});

router.post("",multer({storage:storage}).single("image"),(req,res,next)=>{
  const url = req.protocol+'://'+req.get('host');
  console.log(req.body.imagePath,'-image path');
  const post = new Post({
    _id:req.id,
    title:req.body.title,
    content:req.body.content,
    imagePath:url+"/images/"+ req.file.filename
  });
  post.save().then(createdPost =>{
    console.log('add posts result',createdPost);
    console.log(post);
    res.status(201).json({
      message:'posts added',
      post:{
        ...createdPost,
        id:createdPost._id
      }
    });
  });
});

router.get("",(req,res,next)=>{
  Post.find()
    .then(documents =>{
      console.log(documents);
      res.status(200).json({
        message:'response from server',
        posts:documents
      });
    })
});

router.put("/:id" ,multer({storage:storage}).single("image"),(req,res,next)=>{
  const url = req.protocol+'://'+req.get('host');
  const post = new Post({
    // _id:req.body.id,
    title:req.body.title,
    content:req.body.content,
    imagePath: url + "/images/"+req.file.filename
  });
  console.log('inside put');
  Post.updateOne({_id:req.params.id},post).then(result =>{
    console.log('result',result);
    res.status(200).json({
      message:'update successfull'
    });
  });
});

router.delete("/:id",(req,res,next)=>{
  console.log('request id  - ',req.params.id);
  Post.deleteOne({_id:req.params.id}).then(result => {
    if(result.deletedCount === 0){
      console.log('no records found');
    }else{
      console.log('deleted success',result);
      res.status(200).json({
        message:'Post deleted successfully'
      })
    }
  })
});

module.exports = router;
