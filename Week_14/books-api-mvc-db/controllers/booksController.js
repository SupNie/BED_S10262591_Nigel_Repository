//booksController module that contains the functions for handling HTTP/GET request
const Book = require("../models/book");

//getAllBooks: This function utilizes the Book.getAllBooks method to retrieve all books. It catches potential errors and sends appropriate error responses to the client.
const getAllBooks = async (req, res) => {
  try 
  {
    const books = await Book.getAllBooks();
    res.json(books);
  } 
  catch (error) 
  {
    console.error(error);
    res.status(500).send("Error retrieving books");
  }
};

//getBookById: This function retrieves a book by ID using the Book.getBookById method. It parses the id from the request parameters, checks for successful retrieval, and sends either the retrieved book object or a "Book not found" response with a 404 status code.
const getBookById = async (req, res) => {
  const bookId = parseInt(req.params.id);
  try 
  {
    const book = await Book.getBookById(bookId);
    if (!book) 
    {
      return res.status(404).send("Book not found");
    }
    res.json(book);
  } 
  catch (error) 
  {
    console.error(error);
    res.status(500).send("Error retrieving book");
  }
};
//Create a book and retrieves the new book data from the request body (req.body).
//It calls the Book.createBook method with the new book data to create the book record.
//Handles POST /books HTTP method to create a new book
const createBook = async (req, res) => 
{
    const newBook = req.body;
    try 
    {
      const createdBook = await Book.createBook(newBook);
      res.status(201).json(createdBook);
    } 
    catch (error) 
    {
      console.error(error);
      res.status(500).send("Error creating book");
    }
};

const updateBook = async (req, res) => 
{
    const bookId = parseInt(req.params.id);
    const newBookData = req.body;
  
    try 
    {
      const updatedBook = await Book.updateBook(bookId, newBookData);
      if (!updatedBook) 
      {
        return res.status(404).send("Book not found");
      }
      res.json(updatedBook);
    } 
    catch (error) 
    {
      console.error(error);
      res.status(500).send("Error updating book");
    }
};
//Handles PUT /books/id HTTP method in the app.js to update the book by providing the id
const updateBookAvailability = async (req, res) => 
{
  const bookId = parseInt(req.params.id);
  const availabilityStatus = req.body;

  try 
  {
    const updatedBook = await Book.updateBookAvailability(bookId, availabilityStatus);
    if (!updatedBook) 
    {
      return res.status(404).send("Book not found");
    }
    res.json(updatedBook);
  } 
  catch (error) 
  {
    console.error(error);
    res.status(500).send("Error updating book availability");
  }
};

//Handles DELETE /books/id HTTP method to delete the book by its id
const deleteBook = async (req, res) => 
{
  const bookId = parseInt(req.params.id);

  try 
  {
    const success = await Book.deleteBook(bookId);
    if (!success) 
    {
      return res.status(404).send("Book not found");
    }
    res.status(204).send();
  } 
  catch (error) 
  {
    console.error(error);
    res.status(500).send("Error deleting book");
  }
};

////module.exports is a special object that allows you to export values (functions, variables, classes) from your module file to be used in other parts of your application.
module.exports = {
  getAllBooks,
  createBook,
  getBookById,
  updateBook,
  updateBookAvailability,
  deleteBook,
};