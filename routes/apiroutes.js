const db = require("../models/index.js");
const axios = require("axios");
const cheerio = require("cheerio");

module.exports = function(app) {
    app.get("/articleHeadlines", function(req, res) {
        axios.get("http://www.bloodhorse.com/horse-racing")
            .then(function(response) {
                let $ = cheerio.load(response.data);
                $("article h4").each(function(i, element) {
                    let result = {};
                    result.title = $(this).children("a").text();
                    result.link = $(this).children("a").attr("href");
    
                    db.Article.create(result)
                        .then(function(dbArticle) {
                            console.log(dbArticle);
                        }).catch(function(err) {
                            console.log(err);
                        });
                });
                res.send("Scrape complete");
        });
    });
    
    // Route for getting all articles
    app.get("/", function(req, res) {
        db.Article.find({})
            .then(function(dbArticles) {
                res.json(dbArticles);
                res.render("index", dbArticles);
            }).catch(function(err) {
                res.json(err);
            });
    });
    
    // Route for viewing all saved articles
    app.get("/saved", function(req, res) {
        db.Article.find({}) // need to edit this
            .then(function(dbArticles) {
                res.json(dbArticles);
                res.render("saved", dbArticles);
            }).catch(function(err) {
                res.json(err);
            });
    });
    
    app.get("/articles/:id", function(req, res) {
        db.Article.findOne({
            _id: req.params.id
        }).populate("Comment")
            .then(function(dbArticles) {
                res.json(dbArticles);
            }).catch(function(err) {
                res.json(err);
            });
    });
    
    // Route for saving an article's associated comment
    app.post("/articles/:id", function(req, res) {
        db.Comment.create(req.body)
            .then(function(dbComments) {
                return db.Article.findOneAndUpdate(
                    { 
                        _id: req.params.id
                    },
                    {
                        comment: dbComments._id
                    },
                    {
                        new: true
                    }
                );
            }).then(function(dbArticle) {
                res.json(dbArticle);
            }).catch(function(err) {
                res.json(err);
            });
    });
}