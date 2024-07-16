// booksController.test.js

const booksController = require("../controllers/booksController");
const Book = require("../models/book");

// Mock the Book model
jest.mock("../models/book"); // Replace with the actual path to your Book model

describe("booksController.getAllBooks", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  it("should fetch all books and return a JSON response", async () => {
    const mockBooks = [
      { id: 1, title: "The Lord of the Rings" },
      { id: 2, title: "Pride and Prejudice" },
    ];

    // Mock the Book.getAllBooks function to return the mock data
    Book.getAllBooks.mockResolvedValue(mockBooks);

    const req = {};
    const res = {
      json: jest.fn(), // Mock the res.json function
    };

    await booksController.getAllBooks(req, res);

    expect(Book.getAllBooks).toHaveBeenCalledTimes(1); // Check if getAllBooks was called
    expect(res.json).toHaveBeenCalledWith(mockBooks); // Check the response body
  });

  it("should handle errors and return a 500 status with error message", async () => {
    const errorMessage = "Database error";
    Book.getAllBooks.mockRejectedValue(new Error(errorMessage)); // Simulate an error

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await booksController.getAllBooks(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Error retrieving books");
  });
});

describe("booksController.updateBookAvailability", () => {
    beforeEach(() => {
      jest.clearAllMocks(); // Clear mock calls before each test
    });
  
    it("should update the availability of the book and return a JSON response", async () => {
      const bookId = 1;
      const availabilityStatus = { available: true };
      const req = {
        params: { id: bookId.toString() },
        body: availabilityStatus,
      };
      const res = {
        json: jest.fn(),
      };
  
      const updatedBook = { id: bookId, ...availabilityStatus };
      Book.updateBookAvailability.mockResolvedValue(updatedBook);
  
      await booksController.updateBookAvailability(req, res);
  
      expect(Book.updateBookAvailability).toHaveBeenCalledTimes(1);
      expect(Book.updateBookAvailability).toHaveBeenCalledWith(bookId, availabilityStatus);
      expect(res.json).toHaveBeenCalledWith(updatedBook);
    });
  
    it("should handle errors and return a 500 status with error message", async () => {
      const bookId = 1;
      const availabilityStatus = { available: false };
      const req = {
        params: { id: bookId.toString() },
        body: availabilityStatus,
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
  
      const errorMessage = "Database error";
      Book.updateBookAvailability.mockRejectedValue(new Error(errorMessage));
  
      await booksController.updateBookAvailability(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error updating book");
    });
  
    it("should return a 404 status if the book is not found", async () => {
      const bookId = 999; // Assume this ID does not exist
      const availabilityStatus = { available: true };
      const req = {
        params: { id: bookId.toString() },
        body: availabilityStatus,
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
  
      Book.updateBookAvailability.mockResolvedValue(null);
  
      await booksController.updateBookAvailability(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("Book not found");
    });
});