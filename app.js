//linking all the necessary library
var express = require("express"),
bodyParser  = require("body-parser"),
mongoose    = require("mongoose"),
methodOverride = require("method-override")

//things for database starts here
//exporting the modules from another folder to here
var auth = require("./models/auth"),
loggedIn = require("./models/loggedIn"),
unLoggedIn = require("./models/unLoggedIn")
//confirguring all the libraries
var app = express();
mongoose.connect(process.env.DATABASEURL);
console.log(process.env.DATABASEURL);
/* mongoose.connect("mongodb://shiv:shankar7@ds145800.mlab.com:45800/kamping"); */
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static("styles"));
app.use(express.static("kampsJavascript"));

//=====================
//All Routs Starts here
//=====================
app.use(auth);
app.use(loggedIn);
app.use(unLoggedIn);
//app starts here
//user cannot go to any page by link or postOffice if not logged in
/* function isLoggedIn(req,reg,next){
    if(req.isAuthenticated())
    {
        return next();
    }
    reg.redirect("/kamping/login");
} */
// listening to the server
app.listen(3000, function(){
    console.log("server is running successfully");
})

/* app.listen(process.env.PORT, process.env.IP,function(){
	console.log("Node server successfully started");
}) */