//jshint eversion:6
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// mongoose.connect("mongodb+srv://admin-srishti:12345@cluster0.swjyj.mongodb.net/accountsDB");
// mongodb+srv://admin-srishti:12345@cluster0.swjyj.mongodb.net/accountsDB
mongoose.connect("mongodb://localhost:27017/AccountsDB")
const app=express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const infoSchema = mongoose.Schema({
    username:String,
    password:String,
    thoughts:[{
        date:String,
        entry:String
    }]
})

const  Account = mongoose.model("Account",infoSchema);

app.get("/",function(req,res){
    res.render("home");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.get("/acc/:user",function(req,res){
    Account.findOne({username:req.params.user},function(err,account){
        if(err){
            console.log(err);
        }else{
            res.render("account",{account:req.params.user,entries:account.thoughts});            
        }
    });
});

app.get("/acc/:user/thoughts",function(req,res){
    res.render("thoughts",{account:req.params.user});
});

app.post("/confirm",async function(req,res){
    var a=req.body.pswd1;
    var b=req.body.pswd2;
    console.log(req.body);
    if(a!=b)
    {
        res.redirect("/register");
    }
    else
    {
        res.render("intro",{user:req.body.user});
        const account = new Account({
            username:req.body.user,
            password:a,
            thoughts:[]
        });
        await account.save(function(err){
            if(err){
                console.log(err);
            }
        });
    }
});

app.post("/acc/:user/thoughts",function(req,res){
    console.log(req.params.user);
    Account.findOneAndUpdate({username:req.params.user},{$push:{thoughts:{date:"xyz",entry:req.body.entry}}},function (error, success) {
        if (error) {
            console.log(error);
        } else {
            console.log(success);
        }
    });
    res.render("account", {account:req.params.user});
});

app.listen(3000,function(){
    console.log("Listening to port 3000");
});
