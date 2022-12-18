const Book = require("../models/book");
const Author = require("../models/author");
const Genre = require("../models/genre");
const BookInstance = require("../models/bookinstance");

const async = require("async");
exports.index = (req, res) => {
  async.parallel(
    {
      book_count(callback) {
        Book.countDocuments({}, callback);
      },
      book_instance_count(callback) {
        BookInstance.countDocuments({}, callback);
      },
      book_instance_available_count(callback) {
        BookInstance.countDocuments({status: "Available"}, callback);
      },
      author_count(callback) {
        Author.countDocuments({},callback);
      },
      genre_count(callback) {
        Genre.countDocuments({},callback);
      },
    },
    (err, results)=>{
      res.render("index", {
        title: "Local Library Home",
        error: err,
        data: results,
      });
    });
};

// Display list of all books.
exports.book_list = (req, res, next) => {
  Book.find({},"title author")
    .sort({title: 1})
    .populate("author")
    .exec(function(err,list_books) {
      if (err) {
        return next(err);
      }
      res.render("book_list",{title:"Book List",book_list:list_books});
    });
};

// Display detail page for a specific book.
exports.book_detail = (req, res, next) => {
  async.parallel(
  {
    book(callback) {
      Book.findById(req.params.id)
        .populate("author")
        .populate("genre")
        .exec(callback);
    },
    book_instance(callback) {
      BookInstance.find({book: req.params.id})
        .exec(callback);
    }
  },
  (err, results) => {
    if (err) {
      return next(err);
    }
    if (results == null) {
      const err = new Error("Book not Found");
      err.status = 404;
      return next(err);
    }
    res.render("book_detail",{
      title: "Book Detail",
      book: results.book,
      book_instance: results.book_instance,
    });
  });
};

// Display book create form on GET.
exports.book_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Book create GET");
};

// Handle book create on POST.
exports.book_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Book create POST");
};

// Display book delete form on GET.
exports.book_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Book delete GET");
};

// Handle book delete on POST.
exports.book_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Book delete POST");
};

// Display book update form on GET.
exports.book_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Book update GET");
};

// Handle book update on POST.
exports.book_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Book update POST");
};
