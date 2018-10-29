
var mongoose = require("mongoose");

//making a comment schema, it will record all the comments on a post
var commentSchema = new mongoose.Schema({
    comment: String,
    author: String,
    authorId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userauths"
    }
});
//making model for the comment Schema
module.exports = mongoose.model("comments",commentSchema);