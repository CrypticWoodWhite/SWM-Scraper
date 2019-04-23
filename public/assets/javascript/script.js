$(document).ready(function() {

    // initiate page by scraping articles and displaying them
    let $emptyMssg = $("#empty-mssg");
    const initPage = () => {
        $emptyMssg.empty();

        $.post("/api/articles").then(function() {
            $.get("/api/articles").then(function(res) {
                if (res || res.length > 0) {
                    $emptyMssg.hide();
                }
                else {
                    $emptyMssg.show();
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


    

    // $("#clear-articles").on("click", clearArticles());
    // $(".save-comment").on("click", saveComment());

})