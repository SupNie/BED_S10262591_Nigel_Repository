// book.test.js
const Book = require("../models/book");
const sql = require("mssql");

jest.mock("mssql"); // Mock the mssql library

describe("Book.getAllBooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should retrieve all books from the database", async () => {
    const mockBooks = [
      {
        book_id: 1,
        title: "The Lord of the Rings",
        author: "J.R.R. Tolkien",
        availability: "Y",
      },
      {
        book_id: 2,
        title: "Pride and Prejudice",
        author: "Jane Austen",
        availability: "Y",
      },
    ];

    const mockRequest = {
      query: jest.fn().mockResolvedValue({ recordset: mockBooks }),
    };
    const mockConnection = {
      request: jest.fn().mockReturnValue(mockRequest),
      close: jest.fn().mockResolvedValue(undefined),
    };

    sql.connect.mockResolvedValue(mockConnection); // Return the mock connection

    const books = await Book.getAllBooks();

    expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
    expect(mockConnection.close).toHaveBeenCalledTimes(1);
    expect(books).toHaveLength(2);
    expect(books[0]).toBeInstanceOf(Book);
    expect(books[0].id).toBe(1);
    expect(books[0].title).toBe("The Lord of the Rings");
    expect(books[0].author).toBe("J.R.R. Tolkien");
    expect(books[0].availability).toBe("Y");
    // ... Add assertions for the second book
    
    expect(books[1]).toBeInstanceOf(Book);
    expect(books[1].id).toBe(2);
    expect(books[1].title).toBe("Pride and Prejudice");
    expect(books[1].author).toBe("Jane Austen");
    expect(books[1].availability).toBe("Y");

  });

  it("should handle errors when retrieving books", async () => {
    const errorMessage = "Database Error";
    sql.connect.mockRejectedValue(new Error(errorMessage));
    await expect(Book.getAllBooks()).rejects.toThrow(errorMessage);
  });
});


// book.test.js (continue in the same file)
describe("Book.updateBookAvailability", () => {
    // ... mock mssql and other necessary components
    beforeEach(() => {
       jest.clearAllMocks();
    });
    
  
    it("should update the availability of a book", async () => {
      // ... arrange: set up mock book data and mock database interaction
      // ... act: call updateBookAvailability with the test data
      // ... assert: check if the database was updated correctly and the updated book is returned
      const bookId = 1;
      const availabilityStatus = { available: true };

      const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue({
        rowsAffected: [1],
        recordset: [{ book_id: bookId, ...availabilityStatus }],
        }),
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };

      sql.connect.mockResolvedValue(mockConnection);

      const updatedBook = await Book.updateBookAvailability(bookId, availabilityStatus);

      expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
      expect(mockRequest.input).toHaveBeenCalledWith("id", sql.Int, bookId);
      expect(mockRequest.input).toHaveBeenCalledWith("available", sql.Bit, availabilityStatus.available);
      expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("UPDATE Books SET availability = @available WHERE book_id = @id"));
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
      expect(updatedBook).toEqual({ book_id: bookId, ...availabilityStatus });
    });
  
    it("should return null if book with the given id does not exist", async () => {
      // ... arrange: set up mocks for a non-existent book id
      // ... act: call updateBookAvailability
      // ... assert: expect the function to return null
      const bookId = 999; // Assume this ID does not exist
      const availabilityStatus = { available: true };

      const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue({
        rowsAffected: [0], // No rows affected, meaning the book was not found
        }),
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };

      sql.connect.mockResolvedValue(mockConnection);

      const updatedBook = await Book.updateBookAvailability(bookId, availabilityStatus);

      expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
      expect(mockRequest.input).toHaveBeenCalledWith("id", sql.Int, bookId);
      expect(mockRequest.input).toHaveBeenCalledWith("available", sql.Bit, availabilityStatus.available);
      expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("UPDATE Books SET availability = @available WHERE book_id = @id"));
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
      expect(updatedBook).toBeNull();

    });
  
    // Add more tests for error scenarios (e.g., database error)
    it("should handle errors when updating book availability", async () => {
        const bookId = 1;
        const availabilityStatus = { available: true };
        const errorMessage = "Database Error";
    
        const mockRequest = {
          input: jest.fn().mockReturnThis(),
          query: jest.fn().mockRejectedValue(new Error(errorMessage)),
        };
        const mockConnection = {
          request: jest.fn().mockReturnValue(mockRequest),
          close: jest.fn().mockResolvedValue(undefined),
        };
    
        sql.connect.mockResolvedValue(mockConnection);
    
        await expect(Book.updateBookAvailability(bookId, availabilityStatus)).rejects.toThrow(errorMessage);
    
        expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
        expect(mockRequest.input).toHaveBeenCalledWith("id", sql.Int, bookId);
        expect(mockRequest.input).toHaveBeenCalledWith("available", sql.Bit, availabilityStatus.available);
        expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("UPDATE Books SET availability = @available WHERE book_id = @id"));
        expect(mockConnection.close).toHaveBeenCalledTimes(1);
    });

});
  