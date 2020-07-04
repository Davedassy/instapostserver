const router = require("express").Router();
const mongoose = require("mongoose");
const verifyLogin = require("../middleware/requireLogin")

 const Post = mongoose.model("Post")

// get all post
router.get("/allpost",(req,res) => {
    Post.find()
    .populate("postedBy", "_id name")
    .then(posts => {
        res.status(200).json({posts})
    })
    .catch(err => {
        console.log(err)
    })
})


//  create a post
router.post("/createpost",verifyLogin,(req,res) => {
    const { title,body } = req.body
    if(!title || !body){
       return res.status(422).json({error:"Please add all the fields"})
    }
    console.log(req.user)
    req.user.password = undefined;

    const post = new Post({
        title,
        body,
        postedBy:req.user
    })
    post.save()
        .then( result =>{
          res.status(201).json({post:result})
    })
    .catch( err => {
        console.log(err)
    })
})


// get the post by a sign in user
router.get("/mypost",verifyLogin, (req,res) => {
    console.log(req.user._id)
    Post.find({postedBy:req.user._id})
    .populate("postedBy", "_id name")
    .then(mypost => {
        res.status(200).json({mypost})
    })
    .catch( err => {
        console.log(err)
    })
})


module.exports = router