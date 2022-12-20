const BookInstance = require("../models/bookinstance");
const {body, validationResult} = require("express-validator");
const Book = require("../models/book");
// Display list of all BookInstances.
exports.bookinstance_list = (req, res) => {
  BookInstance.find()
    .populate("book")
    .exec(function(err, list_bookinstances) {
      res.render("bookinstance_list", {
        title:"Book Instance List",
        bookinstance_list:list_bookinstances,
      });
    });
};

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = (req, res, next) => {
  BookInstance.findById(req.params.id)
    .populate("book")
    .exec((err, bookinstance) => {
      if (err) {
        return next(err);
      }
      if (bookinstance == null) {
        // No results.
        const err = new Error("Book copy not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render("bookinstance_detail", {
        title: `Copy: ${bookinstance.book.title}`,
        bookinstance,
      });
    });
};


// Display BookInstance create form on GET.
exports.bookinstance_create_get = (req, res,next) => {
  Book.find({}, "title").exec((err,books)=> {
    if (err) {
      return next(err);
    }
    res.render("bookinstance_form", {
    title:"Create BookInstance",
    book_list: books,
    });
  });
};

// Handle BookInstance create on POST.
exports.bookinstance_create_post = [
  body(),
  body(),
  body(),
  body(),
  (req,res,next) => {
    const errors = validationResult(req);
    const bookinstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
    });
    if (!errors.isEmpty()) {
      Book.find({}, "title").exec(function(err, books) {
        if (err) {
          return next(err);
        }
        res.render("bookinstance_form", {
          title: "Create BookInstance",
          book_list: books,
          selected_book: bookinstance.book._id,
          errors: errors.array(),
          bookinstance,
        });
      });
      return;
    }
    bookinstance.save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect(bookinstance.url);
    });
  }
];

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: BookInstance delete GET");
};

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: BookInstance delete POST");
};

// Display BookInstance update form on GET.
exports.bookinstance_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: BookInstance update GET");
};

// Handle bookinstance update on POST.
exports.bookinstance_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: BookInstance update POST");
};
