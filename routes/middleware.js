var Books = require("../models/books.js");

module.exports = {
    //middleware to check if user is logged in
    isLoggedIn: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.redirect("/");
        }
    },
    isCorrectUser: (req, res, next) => {
        //Check if the user making the action is indeed the owner of the book or of the request
        if (req.isAuthenticated()) {
            Books.findOne({_id: req.body._id}, (err, book) => {
                if (err) {
                    console.log("User not found");
                }
                else if ((req.body.accept && book.owner === req.user.username) || (req.body.cancel && (book.owner === req.user.username || book.requestedBy === req.user.username ) ) ) {
                    return next();
                }
                res.redirect('back');
            });
        } else {
            res.redirect('back');
        }
    }
};