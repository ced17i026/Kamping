
var passport = require("passport"),
passportLocal = require("passport-local"),
expressSession = require("express-session"),
passportLocalMongoose = require("passport-local-mongoose"),
express = require("express"),
userAuth = require("./userAuth"),
user = require("./user"),
flash = require("connect-flash");
var app = express.Router();

//configuring the flash-message
app.use(flash());
//config the passport
app.use(expressSession({
    secret: "his is shiv shankar",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(userAuth.authenticate()));
passport.serializeUser(userAuth.serializeUser());
passport.deserializeUser(userAuth.deserializeUser());

app.use(function(req,reg,next){
    reg.locals.currentUser = req.user;
    reg.locals.error = req.flash("error");
    reg.locals.success = req.flash("success");
    next();
})
//getting user signup request
app.get("/kamping/signup",function(req,reg){
    reg.render("signup.ejs");
})

//getting post request for signup page
app.post("/kamping/signup",function(req,reg){
    userAuth.register(new userAuth({username : req.body.username}),req.body.password,function(err,data){
        if(err)
        {
            console.log(err);
            return reg.redirect("/kamping/signup");
        }
        var body = {name: req.body.name};
        user.create(body,function(err,user){
            user.authentication.push(data);
            user.save();
        })
        passport.authenticate("local")(req,reg,function(){
            user.find({authentication:req.user._id},function(err,user){
                req.flash("success","Welcome "+user[0]['name']);
                reg.redirect("/kamping");
            })
        })
    })
})
//user login
app.get("/kamping/login",function(req,reg){
    reg.render("login.ejs")
})
//user post request for login or to verify the user
app.post("/kamping/login",passport.authenticate("local",{
    successRedirect : "/kamping",
    failureRedirect : "/kamping/login"
}),function(req,reg){
    
})
//logging the user out 
app.get("/kamping/logout",function(req,reg){
    req.flash("success", " You Have Been Successfully Logged Out, Thanks for Visiting");
    req.logout();
    reg.redirect("/kamping");
})

module.exports = app;