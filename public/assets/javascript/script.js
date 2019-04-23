$(document).ready(function() {

    // initiate page by scraping articles and displaying them
    // THIS WORKS GO WORK ON SOMETHING ELSE CATHERINE
    let $emptyMssg = $("#empty-mssg");
    const displayArticles = () => {
        $.post("/api/articles").then(function() {
            $.get("/api/articles").then(function(res) {
                if (res || res.length > 0) {
                    $emptyMssg.removeClass("show");
                    $emptyMssg.addClass("hide");
                }
                else {
                    $emptyMssg.removeClass("hide");
                    $emptyMssg.addClass("show");
                }
            })
        }).catch(function(err) {
            console.log(err);
        });
    }
    displayArticles();

    // scrape for more articles and display them
    // WORKS
    $("#scrape-articles").on("click", displayArticles());

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
        $(this).parent("li").remove();
    })

    // page where to see saved articles
    // THIS WORKS YAY ON TO THE NEXT ONE!
    $("#view-saved-articles").on("click", function(event) {

        let $emptySvdMssg = $("#empty-svd-mssg");
        $.get("/saved").then(function(res) {
            if (res || res.length > 0) {
                if ($emptySvdMssg.hasClass("show")) {
                    $emptySvdMssg.removeClass("show");
                    $emptySvdMssg.addClass("hide");
                }
            }
            else {
                if ($emptySvdMssg.hasClass("hide")) {
                    $emptySvdMssg.removeClass("hide");
                    $emptySvdMssg.addClass("show");
                }
            }
        }).catch(function(err) {
            console.log(err);
        });
    });

    // delete single saved article (change saved to false)
    // WORKS WOOHOO
    $(".delete").on("click", function(event) {
        event.preventDefault();

        let id = $(this).data("ident");
        $.ajax("/api/articles/"+ id, {
            type: "PUT",
            data: {saved: false}
        }).then(function(err, res) {
            if (err) {
                console.log(err);
            };
        });

        $(this).parent("li").remove();
    });

    // delete all saved articles
    $("#clear-articles").on("click", function(event) {
        $(".saved").remove();

        let $articlesToClear = $(".saved").children("a");

        // below .each() method is not right, need to figure out key/val issue
        $.each($articlesToClear, function(key, val) {
            let id = $articlesToClear[key].data("id");
            console.log(id);
            $.ajax("/api/articles/"+ id, {
                type: "PUT",
                data: {saved: false}
            }).then(function(err, res) {
                if (err) {
                    console.log(err);
                }
                console.log("res of clear click: " + res);
            });
        })

    });

    /////////////////////////////////////////////////
    // COMMENT CODE BELOW
    /////////////////////////////////////////////////

    let $comment = $(".comment-text");
    let $name = $(".commenter-name");
    let allFields = $([]).add($comment).add($name);

    // submit comment
    let submitComment = () => {
        $(".submit-comment").on("click", function(event) {
            event.preventDefault();

            let commentText = $(this).siblings(".comment-text").val();
            let nameText = $(this).siblings(".commenter-name").val();
            let articleId = $(this).parents("form").data("ident");
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
                console.log(res);
            })
        });
    }

    // comment modal
    dialog = $(".dialog-form").dialog({
        autoOpen: false,
        height: 400,
        width: 600,
        modal: true,
        buttons: {
            "Submit comment": submitComment(),
        },
        close: function() {
            form[0].reset();
            allFields.removeClass("ui-state-error");
            dialog.dialog("close");
        }
    });

    let form = dialog.find("form").on("submit", function(event) {
        event.preventDefault();
        submitComment();
    });

    // view comments
    $(".view-add-comments").on("click", function(event) {
        event.preventDefault();
        dialog.dialog( "open" );
    });

})