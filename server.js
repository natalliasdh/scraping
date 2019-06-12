var express = require("express");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");

var PORT = 3000;

var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

/*var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);*/

mongoose.connect("mongodb://localhost/newspeople5", { useNewUrlParser: true });

app.get("/", function (req, res) {

    res.sendFile(path.join(__dirname, "../public/index.html"));
});




app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://people.com/royals/").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
  
      // Now, we grab every h2 within an article tag, and do the following:
      $(".category-page-item-image a").each(function(i, element) {
        // Save an empty result object
        var result = {};
  
        // Add the text and href of every link, and save them as properties of the result object
        result.link = $(element).attr("href");
        result.title = $(element).attr("data-tracking-content-headline");
        result.img = $(element).children("div").attr("data-src");

       /* result.title = $(this).children("a").attr("data-tracking-content-headline");
        result.link = $(this)
        .children("a")
        .attr("href");
      result.img = $(this).find("img").attr("src");*/

      console.log(result);
  
        // Create a new Article using the `result` object built from scraping
      db.News.create(result)
          .then(function(dbNews) {
            // View the added result in the console
            console.log(dbNews);
          })
          .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
          });
      });
  
      // Send a message to the client
     res.send("Scrape Complete");
    });
  });



  app.get("/news", function(req, res) {
    // Grab every document in the Articles collection
    db.News.find({})
      .then(function(dbNews) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbNews);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });



  app.get("/news/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.News.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("note")
      .then(function(dbNews) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbNews);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });




  app.post("/news/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
      .then(function(dbNote) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.News.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote._id } }, { new: true });
      })
      .then(function(dbNews) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbNews);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });



  app.delete("/notes/:id", function(req, res) {
    // Remove a note using the objectID
    db.Note.remove(
      {
        _id: req.params.id
      },
      function(error, removed) {
        // Log any errors from mongojs
        if (error) {
          console.log(error);
          res.send(error);
        }
        else {
          // Otherwise, send the mongojs response to the browser
          // This will fire off the success function of the ajax request
          console.log(removed);
          res.send(removed);
        }
      }
    );
  });
    app.listen(PORT, function () {
        console.log("App running on port " + PORT + "!");
    });