//jshint eversion:6
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// mongoose.connect("mongodb://27017/entries", {useNewUrlParser:true});

const app=express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/",function(req,res){
    res.render("home");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.get("/:acc",function(req,res){
    res.render("account");
});

app.post("/confirm",function(req,res){
    var a=req.body.pswd1;
    var b=req.body.pswd2;
    // console.log(req.body);
    if(a!=b)
    {
        res.redirect("/register");
    }
    else
    {
        res.render("intro");
    }
})
app.listen(3000,function(){
    console.log("Listening to port 3000");
});