const express = require("express");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars"); // ugh!

const app = express();

var PORT = process.env.PORT || 3000;

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.use(express.static("./public"));

app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/bhscraper";
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
