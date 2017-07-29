var Users = require("../models/users.js");
var Books = require("../models/books.js");
var passport = require("passport");
//var baseUrl = "https://fcc-api-projects-tokimatu.c9users.io";

function DbHandler() {
    this.getUser = (req, res, username) => {
        Users.find({username: username}).populate("books2give").populate("books2receive").populate("books").exec((err, user) => {
            if (err) res.send("User not found");
            else {
                res.render("profile", {user: user[0], currentUser: req.user});
            }
        });
    };
    this.createUser = (req, res) => {
        Users.register(new Users({username: req.body.username}), req.body.password, (err, user) => {
            if (err) {
                console.log("Problem when creating user");
                return res.render("register");
            }
            else {
                passport.authenticate("local")(req, res, () => {
                    res.redirect("/");
                });
            }
        });
    };
    this.editUserLocation = (req, res) => {
        Users.update({username: req.body.username}, {"location.city": req.body.city, "location.state": req.body.state}, (err, newUser) => {
            if (err) console.log("Problem updating user location");
            else {
                console.log(req.body.username);
                res.redirect("/users/" + req.body.username);
            }
        });
    };
    // Handling books
    this.getAllBooks = (req, res, id) => {
        Books.find({}, (err, allBooks) => {
            if (err) res.send("Problem getting all books");
            res.send(allBooks);
        });
    };
    this.getOneBook = (req, res, id) => {
        Books.find({_id: id}, (err, book) => {
            if (err) console.log("Book not found");
            else res.send(book[0]);
        });
    };
    this.createBook = (req, res) => {
        req.body.authors = req.body.authors.split(" | ");
        req.body.owner = req.user.username;
        Books.create(req.body, (err, newBook) => {
            if (err) console.log("Problem creating a new book.");
            else {
                Users.update({username: req.user.username}, {$push: {books: newBook._id} }, (err) => {
                    if (err) console.log("Problem updating the user data");
                    else {
                        res.send(newBook);
                    }
                });
            }
        });
    };
    
    //Handling trades
    this.tradeRequest = (req, res) => {
        //The request can only be made if the book was not requested by anyone before
        if (req.user.username === req.body.owner) {
            res.redirect("/");
        }
        
        Books.findOneAndUpdate({_id: req.body._id, requestedBy: {$exists: false} }, {requestedBy: req.user.username}, {new: true}, (err, book) => {
            if (err) console.log("Problem creating the trade request");
            else if (!book) {
                console.log("This book is already set to trade.");
                res.redirect("/books/all");
            }
            else {
                Users.update({username: book.owner}, {$push: {books2give: book._id} }, (err) => {
                    if (err) console.log("Problem creating the trade request");
                    else {
                        Users.update({username: req.user.username}, {$push: {books2receive: book.id} }, (err) => {
                            if (err) console.log("Problem creating the trade request");
                            else {
                                res.redirect("/books/all");
                            }
                        });
                    }
                });
            }
        });
    };
    this.tradeAccept = (req, res) => {
        //Need to update the owner of book, remove book from old user and add to the new owner
        Books.findOneAndUpdate({_id: req.body._id}, { owner: req.body.newOwner, $unset: {requestedBy: 1} }, {new: false}, (err, book) => {
            if (err) console.log("Problem updating the database after accepting the trade");
            //Removing the book from the old owner
            Users.update({username: book.owner}, { $pull: {books2give: req.body._id, books: req.body._id} }, (err) => {
                if (err) console.log("Problem updating the database after accepting the trade");
                Users.update({username: book.requestedBy}, { $pull: {books2receive: req.body._id}, $push: {books: req.body._id}}, (err) => {
                    if (err) console.log("Problem updating the database after accepting the trade");
                    res.redirect('back');
                });
            });
        });
    };
    this.tradeCancel = (req, res) => {
        Books.findOneAndUpdate({_id: req.body._id}, { $unset: {requestedBy: 1} }, {new: false}, (err, book) => {
            if (err) console.log("Problem cancelling the trade");
            Users.update({username: book.requestedBy}, { $pull: {books2receive: req.body._id} }, (err) => {
                if (err) console.log("Problem cancelling the trade");
                Users.update({username: book.owner}, { $pull: {books2give: req.body._id} }, (err) => {
                    if (err) console.log("Problem cancelling the trade");
                    res.redirect('back');
                });
            });
        });
    };
}

module.exports = DbHandler;