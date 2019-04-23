$(document).ready(function() {

    // initiate page by scraping articles and displaying them
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

    $("#scrape-articles").on("click", displayArticles());

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
            console.log("res of save click: " + res);
        });
        $(this).parent("li").remove();
    })

    $("#view-saved-articles").on("click", function(event) {

        let $emptySvdMssg = $("#empty-svd-mssg");
        $.get("/saved").then(function(res) {
            if (res || res.length > 0) {
                if ($emptySvdMssg.hasClass("show")) {
                    $emptySvdMssg.removeClass("show");
                    $emptySvdMssg.addClass("hide");
                }
                else if ($emptySvdMssg.hasClass("hide")) {
                    // do nothing
                }
            }
            else {
                if ($emptySvdMssg.hasClass("hide")) {
                    $emptySvdMssg.removeClass("hide");
                    $emptySvdMssg.addClass("show");
                }
                else if ($emptySvdMssg.hasClass("hide")) {
                    // do nothing
                }
            }
        }).catch(function(err) {
            console.log(err);
        });
    });

    // delete single saved article (change saved to false)
    $(".delete").on("click", function(event) {
        event.preventDefault();

        let id = $(this).data("ident");
        $.ajax("/api/articles/"+ id, {
            type: "PUT",
            data: {saved: false}
        }).then(function(err, res) {
            if (err) {
                console.log(err);
            }
            console.log("res of delete click: " + res);
        });

        $(this).parent("li").remove();
    });


    $(".view-add-comments").on("click", function(event) {
        event.preventDefault();

    })


    
    // delete all saved articles
    $("#clear-articles").on("click", function(event) {
        $(".saved").remove();

    });


    // save comment
    $(".save-comment").on("click", function(event) {
        event.preventDefault();
    });
})