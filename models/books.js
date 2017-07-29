var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Book = new Schema({
    bookId: String,
    title: String,
    authors: [String],
    image: String,
    publishedDate: String,
    owner: String,
    requestedBy: String
});

module.exports = mongoose.model('Book', Book);