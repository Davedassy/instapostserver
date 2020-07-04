const express = require("express");
const mongoose = require("mongoose");
const { MONGO_URI } = require("./keys")
const app = express()



// database connection
mongoose.connect(MONGO_URI,{useUnifiedTopology:true,useNewUrlParser:true})
mongoose.connection.on("connected",() =>{
    console.log("db connection")
})
mongoose.connection.on("error",(err) =>{
    console.log("error in connection")
})

require("./model/user");
require("./model/post")

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(require("./router/auth"))
app.use(require("./router/post"))




app.get("/",(req,res) => {
    res.send("hello world, welcome back")
})

app.get("/about",(req,res) => {
    console.log("dfghj")
    res.send("about page, welcome back")
})

module.exports = app