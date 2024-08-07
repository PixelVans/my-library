if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}


const express = require("express")
const app = express()
const expressLayouts = require("express-ejs-layouts")
const mongoose = require("mongoose")
const indexRouter = require("./routes/index")
const authorRouter = require("./routes/authors")
const bookRouter = require("./routes/books")
const methodOverride = require("method-override")


mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on("error", error => console.error(error))
db.once("open", () => console.log("connected to mongoose"))

app.set("view engine", "ejs")
app.set("views", __dirname + "/views")
app.set("layout", "layouts/layout")
app.use(expressLayouts)
app.use(express.static("public"))
app.use(express.urlencoded({ limit: "10mb", extended: false }));
app.use(methodOverride("_method"))

app.use("/", indexRouter)
app.use("/authors", authorRouter)
app.use("/books",bookRouter)








const PORT = process.env.PORT || 3000;

// Start the server and bind to all interfaces
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
