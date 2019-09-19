$(document).ready(function() {

    // initiate page by scraping articles and displaying them
    // THIS WORKS GO WORK ON SOMETHING ELSE CATHERINE
    const displayArticles = () => {

        $.post("/api/articles").then(function() {
            $.get("/api/articles")
        }).catch(function(err) {
                console.log(err);
        });
    };

    // scrape for more articles and display them
    // WORKS
    $("#scrape-articles").on("click", function() {
        displayArticles();
    });

    // save article (change saved to true)
    // THIS WORKS NO MORE TOUCHY
    $(".save-article").on("click", function(event) {
        event.preventDefault();

        let id = $(this).data("id");

        $.ajax("/api/articles/"+ id, {
            type: "PUT",
            data: {saved: true}
        }).then(function(err, res) {
            if (err) {
                console.log(err);
            }
        });
        $(this).parents(".not-saved").remove();
    })

    // page where to see saved articles
    // THIS MOSTLY WORKS
    $("#view-saved-articles").on("click", function(event) {

        let $emptySvdMssg = $("#empty-svd-mssg");
        $.get("/saved").then(function(res) {
            if (res || res.length > 0) {
                $emptySvdMssg.removeClass("hide");
            };
            // above conditional doesn't work
        }).catch(function(err) {
            console.log(err);
        });
    });

    // delete single saved article (change saved to false)
    // WORKS WOOHOO
    $(".delete").on("click", function(event) {
        event.preventDefault();

        let id = $(this).data("identity");
        $.ajax("/api/articles/"+ id, {
            type: "PUT",
            data: {saved: false}
        }).then(function(err, res) {
            if (err) {
                console.log(err);
            };
        });

        $(this).parents(".saved").remove();
    });

    // delete all saved articles
    // WORKS YIPPEE
    $("#clear-articles").on("click", function(event) {
        event.preventDefault();

        $(".saved").each(function(index) {
            let id = $(this).data("identity");
            $.ajax("/api/articles/"+ id, {
                type: "PUT",
                data: {saved: false}
            }).then(function(err, res) {
                if (err) {
                    console.log(err);
                }
            });
        });

        $(".saved").remove();

    });

    /////////////////////////////////////////////////
    // COMMENT CODE BELOW
    /////////////////////////////////////////////////

    let $comment = $(".comment-text");
    let $name = $(".commenter-name");
    let allFields = $([]).add($comment).add($name);
    let form = $("#comment-form");

    // submit comment
    // works
    $(".submit-comment").on("click", function(event) {
        event.preventDefault();

        let commentText = $(this).siblings(".comment-text").val();
        let nameText = $(this).siblings(".commenter-name").val();
        let articleId = $(this).parents("form").data("identity");
        let newComment = {
            name: nameText,
            text: commentText,
            article: articleId
        };

        $.ajax("/api/comments/" + articleId, {
            type: "POST",
            data: newComment
        }).then(function(err, res) {
            if (err) {
                console.log(err);
            };
        });
        form[0].reset();
        allFields.removeClass("ui-state-error");
        location.reload();
    });
    
    // comment modal

    const dialog = $(".dialog-form").dialog({
        autoOpen: false,
        minHeight: 300,
        maxHeight:1200,
        width: 600,
        modal: true,
        closeText: "x",
        close: function() {
            form[0].reset();
            allFields.removeClass("ui-state-error");
            dialog.dialog("close");
        }
    });

    // view comments
    $(".view-add-comments").on("click", function(event) {
        event.preventDefault();

        $(".dialog-form").removeClass("hide");
        $(".dialog-form").addClass("show");

        let articleId = $(this).data("identity");

        $(".dialog-form").attr("data-identity", articleId);
        $(".dialog-form").find("form").attr("data-identity", articleId);
        
        $.get("/api/saved/" + articleId).then(function(res) {
            let commentIds = [res.comments][0];

            if (commentIds.length > 0 || commentIds.length) {
                for (let i=0; i<commentIds.length; i++) {
                    $.get("/api/comments/" + commentIds[i]._id)
                        .then(function(res) {
                            $(".saved-comments").append("<p><b>Comment:</b> " + res.text + "<br><b>Name:</b> " + res.name + "</p>");
                        });
                };                
            } else {
                $(".saved-comments").html("<p>No comments yet.</p>");
            }
        });
        dialog.dialog("open");
    });

})