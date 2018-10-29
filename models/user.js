
var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    name : String,
    authentication : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "userauths"
        }
    ]
})

module.exports = mongoose.model("user", userSchema);