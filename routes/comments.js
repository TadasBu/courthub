var express = require("express");
var router = express.Router({mergeParams : true});
var Court = require("../models/court");
var Comment = require("../models/comment");
var middleware = require("../middleware");
// -----------
// COMMENTS ROUTERS
// -----------

//Comments new
router.get("/new", middleware.isLoggedIn, function(req, res){
    Court.findById(req.params.id, function(err, court){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {court : court});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
    //lookup court using id
    Court.findById(req.params.id, function(err, court){
        if(err){
            console.log(err);
            res.redirect("/courts");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong")
                    console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    court.comments.push(comment);
                    court.save();
                    req.flash("success", "Successfully added comment")
                    res.redirect("/courts/" + court._id);
                }
            });
        }
    });
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Court.findById(req.params.id, function(err, foundCourt){
        if(err || !foundCourt){
            req.flash("error", "Court not found");
            res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err || !foundComment){
                req.flash("error", "Comment not found");
                res.redirect("back");
            } else {
                res.render("comments/edit", {court_id : req.params.id, comment: foundComment});
            }
        });
    });
});

router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment has been edited");
            res.redirect("/courts/" + req.params.id);
        }
    });
});

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment has been deleted")
            res.redirect("/courts/" + req.params.id);
        }
    })
})


module.exports = router;