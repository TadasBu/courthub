var Court = require("../models/court");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkCourtOwnership = function (req, res, next) {
    if(req.isAuthenticated()){
        Court.findById(req.params.id, function(err, foundCourt){
            if(err || !foundCourt){
                    req.flash("error", "Court not found")
                    res.redirect("back");
            } else {
                    if(foundCourt.author.id.equals(req.user._id) || req.user.isAdmin){
                        next();
                    } else {
                        req.flash("error", "You don't have permission to do that")
                        res.redirect("back")
                    }
                    
            }
    });
    } else {
        req.flash("error", "You need to be logged in to do that")
        res.redirect("back")
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                    req.flash("error", "Comment not found")
                    res.redirect("back");
            } else {
                    if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                        next();
                    } else {
                        req.flash("error", "You don't have permission to do that")
                        res.redirect("back")
                    }
            }
    });
    } else {
        req.flash("error", "You need to be logged in to do that")
        res.redirect("back")
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } 
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}


module.exports = middlewareObj;
