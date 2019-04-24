const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    saved: {
        type: Boolean,
        required: true,
        default: false
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

ArticleSchema.pre("save", function(next) {
    Article.find(
        {title: this.title},
        function(err, docs) {
            if (!docs.length) {
                Article.create(function(err) {
                    if (err) {
                        console.log(err);
                    }
                });
                next();
            } else {
                next(new Error("Article already in db!"));
            }
        }
    )
})

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;