var express = require("express"),
kamp = require("./kamp"),
comment = require("./comment"),
user = require("./user");

var app = express.Router();
//any user can add their own kamp
app.get("/kamping/addKamp",isLoggedIn, function(req,reg){
    reg.render("addkamp.ejs");
})
//getting post request from user to add kamp
app.post("/kamping/addkamp",isLoggedIn, function(req,reg){
    user.find({authentication: req.user['_id']},function(err,user){
        req.body.kamp.author = user[0]['name'];
        req.body.kamp.authorId = req.user['_id'];
        kamp.create(req.body.kamp,function(err,kamp){
            if(err)
            {
                console.log("something went wrong");
            }
            else
            {
                reg.redirect("/kamping");
            }
        })
    })
})
var current;
app.use(function(req,reg,next){
    reg.locals.currentUser = req.user;
    current = req.user;
    next();
})
//comments on the camps
app.post("/kamp/:id/comment", function(req,reg){
    var kampId = req.params.id;
    kamp.findById(kampId, function(err,kamp){
        if(err)
        {
            console.log("There is some error while finding")
        }
        else
        {
            user.find({authentication: current['_id']},function(err,data){
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    req.body.kamp.author = data[0]['name'];
                    req.body.kamp.authorId= data[0]['authentication'][0];
                    comment.create(req.body.kamp,function(err,comment){
                        kamp.comments.push(comment);
                        kamp.save();
                    });
                }
            });
            reg.redirect("/kamp/"+kampId);
        }
    })
})

//removing the kamp
app.delete("/kamp/:id/remove",authorize,function(req,reg){
    var kampId = req.params.id;
    kamp.findById(kampId,function(err,kamp){
        kamp.comments.forEach(function(commentId){
            comment.findById(commentId,function(err,comment){
                if(err)
                {}
                else{
                    if(comment == null)
                    {}
                    else
                    {
                        comment.remove();
                    }
                }
            })
        })
        kamp.remove();
        reg.redirect("/kamping");
    })
})
//getting the request for editing the kamp
app.get("/kamp/:id/edit",isLoggedIn,function(req,reg){
    kamp.findById(req.params.id,function(err,kamp){
        reg.render("editkamp.ejs",{kamp: kamp})
    })
})
//getting post request for updating the kamp
app.post("/kamp/:id/edit",authorize,function(req,reg){
    kamp.findById(req.params.id,function(err,kamp){
        kamp.update(req.body.kamp,function(err,kamp){
            if(err)
            {
                console.log(err);
                reg.redirect("/kamp/"+req.params.id);
            }
            else
            {
                reg.redirect("/kamp/"+req.params.id); 
            }
        })
    })
})

//===========================================
//route for updating and deleting the comment
//===========================================

//route for getting the req to editing the kamp
app.get("/kamp/:id/comment/:commentId/edit",authorizeComment,function(req,reg){
    comment.findById(req.params.commentId,function(err,comment){
        reg.render("editComment.ejs",{comment: comment,kampId:req.params.id})
    })
})

app.post("/kamp/:id/comment/:commentId/edit",authorizeComment,function(req,reg){
    comment.findById(req.params.commentId,function(err,comment){
        var updatedComment = {comment: req.body.updatedComment,author: comment.author};
        comment.update(updatedComment,function(err,updatedComment){
            if(err)
            {
                console.log(err);
            }
            else
            {
                reg.redirect("/kamp/"+req.params.id)
            }
        })
        
    })
})
//route for deleting the comment
app.delete("/kamp/:id/comment/:commentId/edit",authorizeComment,function(req,reg){
    comment.findByIdAndRemove(req.params.commentId,function(err){
        if(err)
        {
            console.log(err);
        }
        else
        {
            reg.redirect("/kamp/"+req.params.id);
        }
    })
})

//================================
//Authorization and Authentication
//================================
//function to cheak that only auther or kamp maker should delete the kamp
function authorize(req,reg,next){
    kamp.findById(req.params.id,function(err,kamp){
        if(kamp["authorId"].equals(req.user._id)){
            next();
        }
        else
        {
            reg.redirect("back");
        }
    })
}
//function to cheak weather only the author of comment can edit or delete the comment
function authorizeComment(req,reg,next){
    comment.findById(req.params.commentId,function(err,comment){
        if(comment.authorId.equals(req.user['_id']))
        {
            next();
        }
        else
        {
            reg.redirect("back");
        }
    })
}
//checking weather user is loggedin or not
function isLoggedIn(req,reg,next){
    if(req.isAuthenticated())
    {
        return next();
    }
    req.flash("error","You Need To Log In First")
    reg.redirect("/kamping/login");
}

module.exports = app;