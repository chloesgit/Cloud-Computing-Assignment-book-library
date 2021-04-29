// require express and other modules
const express = require("express");
const app = express();
// Express Body Parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set Static File Directory
app.use(express.static(__dirname + "/public"));

/************
 * DATABASE *
 ************/
let ObjectID = require("mongodb").ObjectID;
const db = require("./models");
const BooksModel = require("./models/books");

/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
 */

app.get("/", function homepage(req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

/*
 * JSON API Endpoints
 */

app.get("/api", (req, res) => {
  // TODO: Document all your api endpoints below as a simple hardcoded JSON object.
  res.json({
    message: "Welcome to my app api!",
    documentationUrl: "35.246.186.192/api/", //leave this also blank for the first exercise
    baseUrl: "35.246.186.192", //leave this blank for the first exercise
    endpoints: [
      {
        method: "GET",
        path: "/api",
        description: "Describes all available endpoints",
      },
      { method: "GET", path: "/api/profile", description: "Data about me" },
      {
        method: "GET",
        path: "/api/books/",
        description: "Get All books information",
      },
      { method: "POST", path: "/api/books/", description: "Add a new book" },
      {
        method: "PUT",
        path: "/api/books/:id",
        description:
          "Modify some informations of the book with a particular id",
      },
      {
        method: "DELETE",
        path: "/api/books/:id",
        description: "Delete a book according to its id",
      },
      // TODO: Write other API end-points description here like above
    ],
  });
});
// TODO:  Fill the values
app.get("/api/profile", (req, res) => {
  res.json({
    name: "Nametest",
    homeCountry: "Countest",
    degreeProgram: "Informatics", //informatics or CSE.. etc
    email: "Testemail",
    deployedURLLink: "35.246.186.192", //leave this blank for the first exercise
    apiDocumentationURL: "35.246.186.192/api", //leave this also blank for the first exercise
    currentCity: "Germany",
    hobbies: ["cooking", "music"],
  });
});
/*
 * Get All books information
 */
app.get("/api/books/", (req, res) => {
  /*
   * use the books model and query to mongo database to get all objects
   */
  db.books.find({}, function (err, books) {
    if (err) throw err;
    /*
     * return the object as array of json values
     */
    res.json(books);
  });
});
/*
 * Add a book information into database
 */
app.post("/api/books/", (req, res) => {
  /*
   * New Book information in req.body
   */
  console.log("t", req.body);
  /*
   * TODO: use the books model and create a new object
   * with the information in req.body
   */
  /*
   * return the new book information object as json
   */
  var newBook = new BooksModel({ ...req.body });
  console.log("r", newBook);
  newBook.save(function (err, newBook) {
    if (err) return console.error(err);
    console.log("ok");
  });
  res.json(newBook);
});

/*
 * Update a book information based upon the specified ID
 */
app.put("/api/books/:id", (req, res) => {
  /*
   * Get the book ID and new information of book from the request parameters
   */
  const bookId = req.params.id;
  const bookNewData = req.body;
  console.log(`book ID = ${bookId} \n Book Data = ${bookNewData}`);
  /*
   * TODO: use the books model and find using the bookId and update the book information
   */
  /*
   * Send the updated book information as a JSON object
   */
  var updatedBookInfo = {
    title: bookNewData.title,
    author: bookNewData.author,
    releaseDate: bookNewData.releaseDate,
    genre: bookNewData.genre,
    rating: bookNewData.rating,
    language: bookNewData.language,
  };
  console.log(updatedBookInfo);
  BooksModel.updateOne({ _id: bookId }, updatedBookInfo, (err, res) => {
    if (err) return console.error(err);
    console.log("ok");
  });
  res.json(updatedBookInfo);
});
/*
 * Delete a book based upon the specified ID
 */
app.delete("/api/books/:id", (req, res) => {
  /*
   * Get the book ID of book from the request parameters
   */
  const bookId = req.params.id;
  /*
   * TODO: use the books model and find using
   * the bookId and delete the book
   */
  /*
   * Send the deleted book information as a JSON object
   */

  var deletedBook = {};

  BooksModel.findByIdAndDelete(bookId, (err, doc) => {
    deletedBook = doc;
  });

  res.json(deletedBook);
});

/**********
 * SERVER *
 **********/

// listen on the port 3000
app.listen(process.env.PORT || 80, () => {
  console.log("Express server is up and running on http://localhost:80/");
});
