const Genre = require("../models/genre");
const Book = require("../models/book");
const async = require("async");
const {body, validationResult} = require("express-validator");
// Display list of all Genre.
exports.genre_list = (req, res, next) => { //jshint ignore:line
  Genre.find()
    .sort({"name":"ascending"})
    .exec(function(err,list_genre) {
      res.render("genre_list",{
        title: "Genre List",
        genre_list: list_genre
      });
    });
};

// Display detail page for a specific Genre.
exports.genre_detail = (req, res, next) => {
  async.parallel(
    {
      genre(callback) {
        Genre.findById(req.params.id).exec(callback);
      },

      genre_books(callback) {
        Book.find({ genre: req.params.id}).exec(callback);
      }
    }, (err, results) =>{
      if (err) {
        return next(err);
      }
      if (results.genre == null) {
        const err = new Error("Genre not Found");
        err.status = 404;
        return next(err);
      }
      res.render("genre_detail",{
        title: "Genre Detail",
        genre: results.genre,
        genre_books: results.genre_books
      });
    });
};

// Display Genre create form on GET.
exports.genre_create_get = (req, res) => {
  res.render("genre_form", { title: "Create Genre" });
};

// Handle Genre create on POST.
exports.genre_create_post = [
  body("name", "Genre name required").trim().isLength({min: 1}).escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    const genre = new Genre({name: req.body.name});
    if (!errors.isEmpty()) {
      res.render ("genre_form", {
        title: "Create Genre",
        genre,
        errors: errors.array(),
      });
      return;
    } else {
      Genre.findOne({name:req.body.name}).exec(function(err, found_genre){
        if (err) {
          return next(err);
        }
        if (found_genre) {
          res.redirect(found_genre.url);
        } else {
          genre.save((err) => {
            if (err) {
              return next(err);
            }
            res.redirect(genre.url);
          });
        }
      });
    }
  }
  ];

// Display Genre delete form on GET.
exports.genre_delete_get = (req, res,next) => {
  async.parallel(
    {
      genre(callback) {
        Genre.findById(req.params.id).exec(callback);
      },
      genre_books(callback) {
        Book.find({genre:req.params.id}).exec(callback);
      }
    },
    (err,results)=> {
      if (err) {
        return next(err);
      }
      if (results.genre == null) {
        const err = new Error("Genre Not Found");
        err.status = 404;
        return next(err);
      }
      res.render("genre_delete",{
        title: "Genre Delete",
        genre: results.genre,
        genre_books: results.genre_books
      });
    });
};

// Handle Genre delete on POST.
exports.genre_delete_post = (req, res, next) => {
  async.parallel(
    {
      genre(callback) {
        Genre.findById(req.body.genreid).exec(callback);
      },
      genre_books(callback) {
        Book.find({genre:req.body.genreid}).exec(callback);
      }
    },
    (err,results)=>{
      if (err) {
        return next(err);
      }
      if (results.genre_books > 0) {
        res.render("genre_detail",{
        title: "Genre Detail",
        genre: results.genre,
        genre_books: results.genre_books
        });
        return;
      }
      Genre.findByIdAndRemove(req.body.genreid,(err)=> {
        if (err) {
          return next(err);
        }
        res.redirect("/catalog/genres");
      });
    });
};

// Display Genre update form on GET.
exports.genre_update_get = (req, res,next) => {
  Genre.findById(req.params.id).exec((err,result)=>{
    if (err) {
      return next(err);
    }
    if (result == null) {
      const err = new Error("Genre Not Found");
      err.status = 404;
      return next(err);
    }
    res.render("genre_form", { title: "Update Genre", genre:result });
  });
};

// Handle Genre update on POST.
exports.genre_update_post = [
  body("name","Name is required").trim().isLength({min:1}).escape(),
  (req,res,next) => {
    const errors = validationResult(req);
    const genre = new Genre({name:req.body.name,_id:req.params.id});
    if (!errors.isEmpty()) {
      Genre.findById(req.params.id).exec((err,result)=> {
        if (err) {
          return next(err);
        }
          res.render("genre_form", { title: "Update Genre", genre:result,errors: errors.array()});
      });
    }
    Genre.findByIdAndUpdate(req.params.id,genre,{},(err,thegenre)=>{
      if (err) {
        return next(err);
      }
      res.redirect(thegenre.url);
    });
  }
];
