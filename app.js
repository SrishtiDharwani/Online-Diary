//jshint eversion:6
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
mongoose.connect(
  "mongodb+srv://admin-srishti:12345@cluster0.swjyj.mongodb.net/accountsDB"
);
// mongodb+srv://admin-srishti:12345@cluster0.swjyj.mongodb.net/accountsDB
// mongoose.connect("mongodb://localhost:27017/AccountsDB");
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const infoSchema = mongoose.Schema({
  username: String,
  password: String,
  thoughts: [
    {
      date: String,
      entry: String,
    },
  ],
});

const Account = mongoose.model("Account", infoSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/register", function (req, res) {
  res.render("register");
});

// app.get("/login", function (req, res) {
//   res.redirect("/acc/"+req.body.user);
//   });

app.get("/acc/:user", function (req, res) {
  Account.findOne({ username: req.params.user }, function (err, account) {
    if (err) {
      console.log(err);
    } else {
      res.render("account", {
        account: req.params.user,
        entries: account.thoughts,
      });
    }
  });
});

app.get("/acc/:user/thoughts", function (req, res) {
  res.render("thoughts", { account: req.params.user });
});

// app.post("/confirm",async function(req,res){
//     var a=req.body.pswd1;
//     var b=req.body.pswd2;
//     console.log(req.body);
//     if(a!=b)
//     {
//         res.redirect("/register");
//     }
//     else
//     {
//         res.render("intro",{user:req.body.user});
//         const account = new Account({
//             username:req.body.user,
//             password:a,
//             thoughts:[]
//         });
//         await account.save(function(err){
//             if(err){
//                 console.log(err);
//             }
//         });
//     }
// });

app.post("/confirm", function (req, res) {
  bcrypt.hash(req.body.pswd2, saltRounds, function (err, hash) {
    const account = new Account({
      username: req.body.user,
      password: hash,
      thoughts: [],
    });
    account.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/acc/" + req.body.user);
      }
    });
  });
});

app.post("/", function (req, res) {
  const user = req.body.user;
  const password = req.body.pswd2;
  // console.log(user,password);
  Account.findOne({ username: user }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password, function (err, result) {
          if (result === true) {
            res.redirect("/acc/" + req.body.user);
          } else {
            res.redirect("/");
          }
        });
      }
    }
  });
});

app.post("/acc/:user/thoughts", function (req, res) {
  console.log(req.params.user);
  Account.findOneAndUpdate(
    { username: req.params.user },
    {
      $push: {
        thoughts: {
          date: new Date().toLocaleDateString(),
          entry: req.body.entry,
        },
      },
    },
    function (error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log(success);
        res.redirect("/acc/" + req.params.user);
      }
    }
  );
});

app.listen(3000, function () {
  console.log("Listening to port 3000");
});
