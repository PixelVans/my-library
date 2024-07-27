const mongoose = require("mongoose")
const Book = require("./book")


const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
  }  
})


authorSchema.pre('findOneAndDelete', async function (next) {
  try {
    const authorId = this.getQuery()._id; // Get the author ID from the query
    const books = await Book.find({ author: authorId }).exec(); // Use async/await for finding books

    if (books.length > 0) {
      return next(new Error('this author has books still')); // Prevent deletion if books exist
    } else {
      next(); // Proceed with deletion
    }
  } catch (err) {
    next(err); // Pass any errors to the error-handling middleware
  }
});


module.exports = mongoose.model("Author",authorSchema)