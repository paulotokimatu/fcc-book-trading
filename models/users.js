var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require("passport-local-mongoose");

var User = new Schema({
    username: String,
    password: String,
    books: [{type: Schema.Types.ObjectId, ref: "Book"}],
    location: {
        city: String,
        state: String
    },
    books2give: [{type: Schema.Types.ObjectId, ref: "Book"}],
    books2receive: [{type: Schema.Types.ObjectId, ref: "Book"}]
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);