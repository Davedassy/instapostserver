const router = require("express").Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SCREET } = require("../keys")
const User = mongoose.model("User");
const requireLogin = require("../middleware/requireLogin")



// registering user
router.post("/signup",(req,res,next) => {
  const { name,email,password } = req.body
  if( !name || !email || !password){
     return res.status(422).json({error:"please add all the fields"})
  }
  User.findOne({email:email})
      .then( (saveUser) =>{
          if(saveUser){
              return res.status(422).json({error:"user already exists with that email"})
          }
        //   using bcrypt to secure user password
          bcrypt.hash(password,10)
                .then(hash => {
                  const user = new User({
                      name,
                      email,
                     password:hash
                  })
                //   save user data to the database
                  user.save()
                  .then(user => {  
                      res.status(201).json({message:"successful"})
                  })
                })
                .catch(err => {
                 console.log(err)
                })
         })
          .catch( err => {
            console.log(err)
        })
   
    })


//  signing the user in
    router.post("/signin",(req,res) => {
        const {email,password } = req.body
        // checking if the user input is empty
        if(!email || !password){
          return  res.status(422).json({error:"Please Provider a Valid email and password"})
        }
        User.findOne({email:email})
        //  checking if the user details is correct
        .then(savedUser => {
            if(!savedUser){
               return res.status(422).json({error:"Please Provider a Valid email and password"})
            }
        bcrypt.compare(password,savedUser.password)
           .then(doMatch => {
            //    if the user details match, then we send the user a token 
               if(doMatch){
                // res.status(201).json({message:"Successfuly signed in"})
                const token = jwt.sign({_id:savedUser._id},JWT_SCREET)
                         res.status(201).json({token:token})
               }
               else{
                return res.status(422).json({error:"Please Provider a Valid email and password"}) 
               }
           })
           .catch(err => {
               console.log(err)
           })
        })
    })
module.exports = router;