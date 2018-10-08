var mongoose = require("mongoose"),
    Court = require("./models/court.js"),
    Comment = require("./models/comment.js");

var data = [
    {
        name: "Some court",
        image: "https://images.unsplash.com/photo-1518409274682-1cb2fe2955a8?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=b6ce2d94a6218709710dd8f604c62425&auto=format&fit=crop&w=1568&q=80",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
    },
    {
        name: "Some court pt. 2",
        image: "https://images.unsplash.com/photo-1505484128222-46ced733ba01?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=9beeaa40e7ad3e86a2f753be4e0193f0&auto=format&fit=crop&w=750&q=80",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
    },
    {
        name: "Some court pt. 3",
        image: "https://images.unsplash.com/photo-1519515711994-12f1cc6d9806?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=242c69d3f6b65943de87b7b558b33bca&auto=format&fit=crop&w=667&q=80",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
    }
    ];

function seedDB(){
    //REMOVE FEW COURTS
    Court.remove({}, function(err){
    if (err){
        console.log(err);
    } else {
        console.log("removed");
            //ADD SOME COURTS
        data.forEach(function(seed){
            Court.create(seed, function(err, data){
                if(err){
                    console.log(err);
                } else {
                    console.log("Created");
                    Comment.create(
                        {
                            text: "This is great!",
                            author: "Me"                            
                        }, function(err, comment){
                            if (err){
                                console.log(err);
                            } else {
                            data.comments.push(comment);
                            data.save();
                            console.log("Created new comment")
                            }
                        })
                }
            });
        });
    }
});
}  

module.exports = seedDB;
