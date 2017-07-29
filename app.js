require('dotenv').config()
var path = require("path");
var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var routes = require('./routes/index.js');
var passport = require("passport");
var LocalStrategy = require("passport-local");
var session = require('express-session');
var User = require("./models/users.js");

mongoose.Promise = Promise;
mongoose.connect(process.env.DB);

//Setting sessions and passport to work with auth
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

//The passport-local-mongoose takes care of writing the code for User.serializeUser() and User.deserializeUser()
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

//Middleware to parse POST requests
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

routes(app);

app.listen((process.env.PORT || 3000), () => {
    console.log("Server up");
});