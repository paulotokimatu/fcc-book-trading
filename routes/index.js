var request = require("request");
var secret =  require("../secret.js");
var DbHandler = require("../controllers/db_handler.js");
var passport = require("passport");
var mw = require("./middleware.js");

function routes(app) {
    var dbHandler = new DbHandler();
    
    app.route("/").get((req, res) => {
        res.render("index", {currentUser: req.user});
    });

    app.route("/register").post((req, res) => {
        dbHandler.createUser(req, res);
    });
    
    app.route("/login").get((req, res) => {
        res.render("login", {currentUser: req.user});
    });
    
    app.route("/login").post(passport.authenticate('local', { failureRedirect: "/login" }), (req, res) => {
        res.redirect("/profile");
    });
    
    app.route("/logout").get((req, res) => {
        req.logout();
        res.redirect("/");
    });
    
    app.route("/profile").get(mw.isLoggedIn, (req, res) => {
        res.redirect("/users/" + req.user.username);
    });
    
    app.route("/users/:username").get((req, res) => {
        dbHandler.getUser(req, res, req.params.username);
    });
    
    app.route("/users/edit").post((req, res) => {
        dbHandler.editUserLocation(req, res);
    });
    
    app.route("/trade/request").post(mw.isLoggedIn, (req, res) => {
        dbHandler.tradeRequest(req, res);
        //res.render("books-list");
    });
    
    app.route("/trade/owner_response").post(mw.isCorrectUser, (req, res) => {
        if (req.body.accept) dbHandler.tradeAccept(req, res);
        else if (req.body.cancel) dbHandler.tradeCancel(req, res);
    });
    
    app.route("/trade/cancel").post(mw.isCorrectUser, (req, res) => {
        dbHandler.tradeCancel(req, res);
    });

    app.route("/api/search/:name").get((req, res) => {
        var query = req.params.name;
        request("https://www.googleapis.com/books/v1/volumes?q=" + query + "&key=" + secret.key, (callErr, callRes, callBody) => {
            res.send(callBody);
        });
    });
    
    app.route("/api/books/all").get((req, res) => {
        dbHandler.getAllBooks(req, res);
    });
    
    app.route("/api/books/:id").get((req, res) => {
        dbHandler.getOneBook(req, res, req.params.id);
    });
    
    app.route("/api/books").post(mw.isLoggedIn, (req, res) => {
        dbHandler.createBook(req, res);
    });

    app.use(function (req, res, next) {
        res.status(404).send("Page not found!");
    });
}
    
module.exports = routes;
    