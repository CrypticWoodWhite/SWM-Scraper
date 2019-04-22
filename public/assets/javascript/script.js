$(document).ready(function() {

    $(".scrape-articles").on("click", scrapeArticles());
    $(".view-saved-articles").on("click", viewSavedArticles());
    $(".save-article").on("click", saveArticle());
    $(".clear-articles").on("click", clearArticles());
    $(".save-comment").on("click", saveComment());

    initPage();

    let $articleCon = $(".article-container");

    const initPage = () => {
        $articleCon.empty();

        $.get("/articleHeadlines").then(function(res) {
            if (res.length > 0) {
                displayArticles(res);
            }
            else {
                $articleCon.prepend("<p>No articles to display</p>");
            }
        })
    }

    const scrapeArticles = () => {

    };

    const viewSavedArticles = () => {

    };

    const saveArticle = () => {

        // if already saved show pop up saying so
        // or disable button?

    };

    const clearArticles = () => {

    };

    const saveComment = () => {



        displayComment();
    };

    const displayComment = () => {

    };

    const displayArticles = () => {

    };

})