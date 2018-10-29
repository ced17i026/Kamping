var mongoose = require("mongoose");

var kampSchema = new mongoose.Schema({
    title: String,
    image: String,
    discription: String,
    author: String,
    authorId:{
        type: mongoose.Schema.Types.ObjectId
    },
    comments: [{
        type : mongoose.Schema.Types.ObjectId,
        ref  : "comments"
    }]
});
//defining the module
module.exports = mongoose.model("kamps",kampSchema);