var express = require("express");
var mongoose = require("mongoose");

var app = express();
mongoose.connect("mongodb://localhost/kamping");

var user = require("./models/kamps")


console.log(user.find({}));