const express = require("express")
const router = express.Router()
const Book = require("../models/book")
const Author = require("../models/author")
const imageMimetypes = ["image/jpeg", "image/png", "image/gif"];
const path = require("path")
// const fs = require("fs")

// const uploadPath = path.join("public", Book.coverImageBasePath)



// const upload = multer({
//     dest: uploadPath,
//     fileFilter: (req, file, callback) => {
//         callback(null, imageMimeTypes.includes(file.mimetype))
//     }
// })

//all books routes
router.get("/", async (req, res) => {
    let query = Book.find();
    
    // Check for search query parameters and apply filters if present
    if (req.query.title) {
      query = query.regex("title", new RegExp(req.query.title, 'i'));
    }
    if (req.query.publishedBefore) {
      query = query.lte("publishDate", req.query.publishedBefore);
    }
    if (req.query.publishedAfter) {
      query = query.gte("publishDate", req.query.publishedAfter);
    }

    try {
        const books = await query.exec();
        res.render("books/index", {
            books: books,
            searchOptions: req.query
        });
    } catch (err) {
        console.error(err);
        res.redirect("/");
    }
});



//new book routes
router.get("/new", async (req, res) => {
renderNewPage(res, new Book())
})

// create book route
router.post("/", async (req, res) => {
    // const fileName = req.file !== null ? req.file.filename : null
   const book = new Book({
         title : req.body.title,
         description : req.body.description,
         publishDate : new Date(req.body.publishDate),
         pageCount : req.body.pageCount,
        author: req.body.author,
       
    })


    saveCover(book, req.body.cover)

    try {
        const newBook = await book.save()
        res.redirect(`books/${newBook.id}`)
        
    } catch {
        // if (book.coverImageName !== null) {
        //     removeBookCover(book.coverImageName)
        // }
        renderNewPage(res, book, true)  
    }
});

// function removeBookCover(fileName) {
//     fs.unlink(path.join(uploadPath, fileName), err => {
//         if(err) console.error(err)
//     })
// }




//show book route
router.get("/:id", async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate("author").exec()                       
        res.render("books/show",{book: book})
    } catch {
        res.redirect("/")
    }
})






//edit book routes
router.get("/:id/edit", async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
    renderEditPage(res, book)
     }
    catch {
        res.redirect("/")
    }
   
    })






//Delete Book page
router.delete("/:id", async (req, res) => {
    let book
    try {
      
        
        book = await Book.findByIdAndDelete(req.params.id)
        res.redirect("/books")
    }
         
    catch (err) {
        console.log(err)
        if (book != null) {
            res.render("books/show", {
                book: book,
            errorMessage: "could not delete book"
           })
        } else {
            res.redirect("/")
        }
    }
})






async function renderNewPage(res, book, hasError = false) {
    renderFormPage(res,book,"new",hasError) 
}


async function renderEditPage(res, book, hasError = false) {
  renderFormPage(res,book,"edit",hasError)
}


// update book route
router.put("/:id", async (req, res) => {
   
    let book;
    try {
        book = await Book.findById(req.params.id)
        book.title = req.body.title
        book.author = req.body.author
        book.publishDate = new Date(req.body.publishDate)
        book.pageCount = req.body.pageCount
        book.description = req.body.description

        if (req.body.cover !== null && req.body.cover !== '') {
            saveCover(book,req.body.cover)
        }
        await book.save()
        res.redirect(`/books/${book.id}`)
    } catch {
        if (book !== null) {
           renderEditPage(res, book, true)   
        } else {
            redirect("/")
        }
         
    }
});










async function renderFormPage(res, book, form,hasError = false) {
    try {
        const authors = await Author.find({}) 
       const params = {
            authors: authors,
            book: book
        }
        if(hasError) params.errorMessage = "Error creating book"
        res.render(`books/${form}`, params)
    } catch {
       res.redirect("/books") 
   }
}











function saveCover(book, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimetypes.includes(cover.type)) {
        book.coverImage = new Buffer.from(cover.data, "base64")
        book.coverImageType = cover.type
    }
}



module.exports = router