var express = require("express"),
kamp = require("./kamp"),
user = require("./user"),
comment = require("./comment");
var app = express.Router();
//getting homePage request
app.get("/kamping", function(req,reg){
    kamp.find({},function(err,kamps){
        if(err)
        {
            console.log(err)
        }
        else
        {
            reg.render("kampingHome.ejs", {data: kamps})
        }
    }) 
})
app.use(function(req,reg,next){
    reg.locals.currentUser = req.user;
    next();
})
//getting the req for landing page
app.get("/",function(req,reg){
    reg.render("kamping.ejs");
})
//more Info about our own kamp
app.get("/kamp/:id",function(req,reg){
    var kampId = req.params.id;
    kamp.findById(kampId).populate("comments").exec(function(err,foundKamp){
        if(err)
        {
            console.log(err);
        }
        else
        {
            reg.render("kampinfo.ejs",{data:foundKamp,comment: comment})
        }
    })
})

module.exports = app;