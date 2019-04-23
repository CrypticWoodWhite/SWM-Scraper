$(document).ready(function() {

    // initiate page by scraping articles and displaying them
    let $emptyMssg = $("#empty-mssg");
    const initPage = () => {

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
    initPage();

    $("#scrape-articles").on("click", initPage());

    // const displayArticles = (articles) => {
    //     // check if article already in db
    //     // check if saved
    // }

    // problem here with _id
    $(".save-article").on("click", function(event) {
        event.preventDefault();
        // only unsaved articles should be on the page
        let id = $(this).data("id");
        console.log("id to be saved: " + id);
        $.ajax("/api/articles/"+ id, {
            type: "PUT",
            data: {saved: true}
        }).then(function(err, res) {
            if (err) {
                console.log(err);
            }
        });
        $(this).parents("li").remove();
    })

    // const clearArticles = () => {

    // };

    // const saveComment = () => {



    //     displayComment();
    // };

    // const displayComment = () => {

    // };
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


    

    // $("#clear-articles").on("click", clearArticles());
    // $(".save-comment").on("click", saveComment());)
})