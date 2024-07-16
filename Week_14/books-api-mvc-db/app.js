const express = require("express");
const booksController = require("./controllers/booksController");
//New for Week 4
const sql = require("mssql"); // Assuming you've installed mssql
const dbConfig = require("./dbConfig");

const bodyParser = require("body-parser"); // Import body-parser
const validateBook = require("./middlewares/validateBook");

const app = express();
const port = process.env.PORT || 3000; // Use environment variable or default port

// Include body-parser middleware to handle JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For form data handling

// Routes for GET requests (replace with appropriate routes for update and delete later)
app.get("/books", booksController.getAllBooks); ///books: This route maps to the getAllBooks function in the booksController. Upon receiving a GET request to this route, the controller function will be invoked to retrieve all book records.
app.get("/books/:id", booksController.getBookById); //books/:id: This route with a dynamic parameter :id maps to the getBookById function. The controller function will extract the ID from the request parameters and use it to retrieve the corresponding book record.

app.post("/books", validateBook, booksController.createBook); // POST for creating books (can handle JSON data)
app.put("/books/:id", validateBook, booksController.updateBookAvailability); // Add validateBook before updateBook
app.delete("/books/:id", booksController.deleteBook); // DELETE for deleting books

//New for Week 4
//Connect to the server
app.listen(port, async () => 
{
  try 
  {
    // Connect to the database
    await sql.connect(dbConfig);
    console.log("Database connection established successfully");
  } 
  catch (err) 
  {
    console.error("Database connection error:", err);
    // Terminate the application with an error code (optional)
    process.exit(1); // Exit with code 1 indicating an error
  }

  console.log(`Server listening on port ${port}`);
});

//New for Week 4
// Close the connection pool on SIGINT signal
process.on("SIGINT", async () => 
{
  console.log("Server is gracefully shutting down");
  // Perform cleanup tasks (e.g., close database connections)
  await sql.close();
  console.log("Database connection closed");
  process.exit(0); // Exit with code 0 indicating successful shutdown
});

//sql.connect(dbConfig) to establish a connection to the database using the configuration details.
//SIGINT signal handler to manage graceful shutdown
//sql.close() to close the connection pool, releasing database resources.

//use http://localhost:3000/books.

//static: This keyword indicates a class method, meaning it can be called directly on the class itself without creating an instance of the Book class.
//async: This keyword signifies that the function is asynchronous, allowing it to handle asynchronous operations like database queries

//id: This parameter represents the ID of the book to be updated.
//newBookData: This parameter is an object containing the updated title and author information.