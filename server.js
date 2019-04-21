const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const db = require("./models/index.js");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

var PORT = process.env.PORT || 3000;

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.use(express.static("./public/assets"));

app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/bhscraper";
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true
});

// Routes

app.get("/scrape", function(req, res) {

    axios.get("http://www.bloodhorse.com/").then(function(response) {
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("article h2").each(function(i, element) {
        // Save an empty result object
        var result = {};

        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this).children("a").text();
        result.link = $(this).children("a").attr("href");

        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
            .then(function(dbArticle) {
                console.log(dbArticle);
            }).catch(function(err) {
                console.log(err);
            });
    });
    res.send("Scrape Complete");
    });
});

// Route for getting all Articles from the db
app.get("/", function(req, res) {
    db.Article.find({})
        .then(function(dbArticles) {
            res.json(dbArticles);
            res.render("index", dbArticles);
        }).catch(function(err) {
            res.json(err);
        });
});

app.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
        .populate("comment")
        .then(function(dbArticles) {
            res.json(dbArticles);
        }).catch(function(err) {
            res.json(err);
        });
});

// Route for saving/updating an Article's associated Note
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

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
