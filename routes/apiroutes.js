const db = require("../models");
const axios = require("axios");
const cheerio = require("cheerio");
require("mongoose");

module.exports = function(app) {

    // Route for displaying all (unsaved) articles
    // WORKS
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

    // scrape articles, save new articles to db
    app.post("/api/articles", function(req, res) {
        axios.get("https://www.swimmingworldmagazine.com/")
            .then(function(response) {
                let $ = cheerio.load(response.data);
                $(".post-detail").each(function(i, element) {

                    let newArticle = {};
                    newArticle.title = $(this).children("h2").text();
                    newArticle.link = "https://www.swimmingworldmagazine.com" + $(this).find("a").attr("href");
                    newArticle.summary = $(this).find("p").text();

                    // below doesn't work in deployed version?!
                    db.Article.find(
                        {title: newArticle.title},
                        function(err, docs) {
                            if (!docs.length) {
                                db.Article.create(newArticle);
                            } else {
                                new Error("Article already in db so not saved");
                            }
                        }
                    );
                });
                res.send("Scrape complete");
            }).catch(function(err) {
                console.log(err);
        });
    });

    // populate unsaved api endpoint
    // WORKS
    app.get("/api/articles", function(req, res) {
        db.Article.find({
            saved: false
        }).then(function(results) {
            res.json(results);
        })
    });

    // update article to saved
    // WORKS
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

    // update article to NOT saved
    // WORKS
    app.put("/api/saved/:_id", function(req, res) {
        db.Article.updateOne(
            {_id: req.params._id},
            {saved: req.body.saved}
        ).then(function(dbSavedArticle) {
            res.json(dbSavedArticle);
            console.log(dbSavedArticle);
        }).catch(function(err) {
            console.log(err);
        });
    });
    
    // displaying all saved articles
    // WORKS KBAI
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

    // populate saved api endpoint
    // WORKS NOTHING ELSE TO SAY
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
    app.get("/api/saved/:id", function(req, res) {
        db.Article.findOne({
            _id: req.params.id
        }).populate("comments")
            .then(function(dbComments) {
                res.json(dbComments);
            }).catch(function(err) {
                console.log(err);
            });
    });
    
    // saving an article's associated comment
    app.post("/api/comments/:id", function(req, res) {
        db.Comment.create(req.body)
            .then(function(dbComments) {
                return db.Article.updateOne(
                    { 
                        _id: req.params.id
                    },
                    {
                        $push: {comments: dbComments._id}
                    }
                );
            }).then(function(dbArticle) {
                res.json(dbArticle);
            }).catch(function(err) {
                console.log(err);
            });
    });

    // retrieving a comment
    app.get("/api/comments/:id", function(req, res) {
        db.Comment.findOne({_id: req.params.id})
            .then(function(articleComments) {
                res.json(articleComments);
                // how do i ensure partial handlebar is populated correctly?
            }
        )
    });

    // retrieving all comments
    app.get("/api/comments", function(req, res) {
        db.Comment.find({})
            .then(function(dbComments) {
                res.json(dbComments);
            }
        )
    });
}