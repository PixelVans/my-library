const express = require("express")
const router = express.Router()
const Author = require("../models/author")
const Books = require("../models/book")

//all authors routes
router.get("/", async (req, res) => {
     let searchOptions = {}
    if (req.query.name !== null && req.query.name !== "") {
          searchOptions.name = new RegExp(req.query.name, "i")
      } 
    try {
        const authors = await Author.find(searchOptions)
        res.render("authors/index", {
            authors: authors,
            searchOptions: req.query
            
        })
    } catch {
       res.redirect("/") 
 }
    
})


//new author routes
router.get("/new", (req, res) => {
    res.render("authors/new",{author: new Author()})
})

// create author route
router.post("/", async (req, res) => {
    const author = new Author({
        name: req.body.name
    });

    try {
        const newAuthor = await author.save();
       
        // res.redirect("/authors");
       
        res.redirect(`/authors/${newAuthor.id}`);
    } catch (err) {
        res.render("authors/new", {
            author: author,
            errorMessage: "Error creating Author"
        });
    }
});




router.get("/:id", async (req, res) => {
    try{ const author = await Author.findById(req.params.id)
    const books = await Books.find({ author: author.id }).exec()
    res.render("authors/show", {
        author: author,
        booksByAuthor: books
    })
    } catch {
        res.redirect("/")
        
    }
   
})
 

router.get("/:id/edit", async (req, res) => {

    try {
        const author = await Author.findById(req.params.id)
      res.render("authors/edit",{author: author})   
    } catch {
        res.redirect("/authors")
    }
   
   
})
 

router.put("/:id", async (req, res) => {
    let author;
    try {
        author = await Author.findById(req.params.id)
        author.name = req.body.name
         await author.save();
     res.redirect(`/authors/${author.id}`);
       
    } catch (err) {
        if (author == null) {
            res.redirect("/")
        } else {
            res.render("authors/edit", {
            author: author,
            errorMessage: "Error updating Author"
        });
        }
        
    }

})
 
// Delete author route
router.delete("/:id", async (req, res) => {
    try {
      // Attempt to find and delete the author by ID
      const result = await Author.findOneAndDelete({ _id: req.params.id });
  
      if (!result) {
        // No author found with the given ID
        return res.status(404).redirect('/');
      }
  
      // Redirect to the authors list after successful deletion
      res.redirect('/authors');
    } catch (err) {
      if (err.message === 'this author has books still') {
        // Handle the error when the author has associated books
        return res.redirect(`/authors/${req.params.id}`);
      } else {
        // Log and handle other errors
        console.error(err);
        res.status(500).send('An error occurred');
      }
    }
  });
























module.exports = router