const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const mongoDb =
  "mongodb+srv://abdogado:abdogado@cluster0.wweh2.mongodb.net/auth-basics?retryWrites=true&w=majority";

mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const User = mongoose.model(
  "User",
  new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
  })
);

const app = express();

app.set("views", __dirname);
app.set("view engine", "ejs");

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/sign-up", (req, res) => {
  res.render("sign-up-form");
});

// Note: There is no sanitation here, for the sake of simplicity
// Note: The project will store the password as a plain text in DB for the sake of
// simplicity, I will hash it later.
app.post("/sign-up", (req, res, next) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  user.save((err) => {
    if (err) {
      return next(err);
    }

    res.redirect("/");
  });
});

app.listen(3000, () => console.log("app listening on port 3000!"));
