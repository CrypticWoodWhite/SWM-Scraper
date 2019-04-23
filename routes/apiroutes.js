const db = require("../models");
const axios = require("axios");
const cheerio = require("cheerio");
require("mongoose");

module.exports = function(app) {

    // Route for displaying all (unsaved) articles
    app.get("/", function(req, res) {
        db.Article.find(
            {saved: false},
            null,
            {limit: 10},
            function(err, dbArticles) {
                if (err) {
                    console.log(err);
                }
                let hbsObject = {
                    articles: dbArticles
                };
                res.render("index", hbsObject);
        }).catch(function(err) {
            console.log(err);
        });
    });

    // scrape articles, check if already in db, save any new article to db
    app.post("/api/articles", function(req, res) {
        axios.get("https://www.swimmingworldmagazine.com/")
            .then(function(response) {
                let $ = cheerio.load(response.data);
                $(".post-detail").each(function(i, element) {

                    // check if article already in db using either title or link

                    // if (article in database) {
                        // then don't save
                    // } else {
                        let newArticle = {};
                        newArticle.title = $(this).children("h2").text();
                        newArticle.link = "http://www.swimmingworldmagazine.com" + $(this).find("a").attr("href");
                        newArticle.summary = $(this).find("p").text();
    
                        db.Article.create(newArticle)
                            .catch(function(err) {
                                console.log(err);
                            });
                    // }

                });
                res.send("Scrape complete");
        }).catch(function(err) {
            console.log(err);
        });
    });

    // populate api endpoint
    app.get("/api/articles", function(req, res) {
        db.Article.find({
            saved: false
        }).then(function(results) {
            res.json(results);
        })
    });

    // update article to saved
    app.put("/api/articles/:_id", function(req, res) {
        db.Article.updateOne(
            {_id: req.params._id},
            {saved: req.body.saved}
        ).then(function(dbSavedArticle) {
            res.json(dbSavedArticle);
        }).catch(function(err) {
            console.log(err);
        });
    });
    
    // displaying all saved articles
    app.get("/saved", function(req, res) {
        db.Article.find(
            {saved: true}
        ).then(function(dbSavedArticles) {
            let hbsObject = {
                articles: dbSavedArticles
            };
            res.render("saved", hbsObject);
        }).catch(function(err) {
            console.log(err);
        });
    });

    // populate api endpoint
    app.get("/api/saved", function(req, res) {
        db.Article.find(
            {saved: true}
        ).then(function(dbArticles) {
            res.json(dbArticles);
        }).catch(function(err) {
            console.log(err);
        });
    });

    // // viewing comments on saved articles
    // app.get("/api/saved/:id", function(req, res) {
    //     db.Article.findOne({
    //         _id: req.params.id
    //     }).populate("Comment")
    //         .then(function(dbArticles) {
    //             res.json(dbArticles);
    //         }).catch(function(err) {
    //             console.log(err);
    //         });
    // });
    
    // // saving an article's associated comment
    // app.post("/api/saved/:id", function(req, res) {
    //     db.Comment.create(req.body)
    //         .then(function(dbComments) {
    //             return db.Article.findOneAndUpdate(
    //                 { 
    //                     _id: req.params.id
    //                 },
    //                 {
    //                     comment: dbComments._id
    //                 },
    //                 {
    //                     new: true
    //                 }
    //             );
    //         }).then(function(dbArticle) {
    //             res.json(dbArticle);
    //         }).catch(function(err) {
    //             console.log(err);
    //         });
    // });
}