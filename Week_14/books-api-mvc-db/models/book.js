//All New for Week 04
const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Book 
{
  //The properties
  constructor(id, title, author)
  {
    this.id = id;
    this.title = title;
    this.author = author;
  }
   
  //getAllBooks: This method retrieves all book records from the "Books" table using a SELECT * query. It establishes a connection, executes the query, parses the results, and returns an array of Book objects constructed from the retrieved data. Finally, it closes the connection.
  static async getAllBooks() 
  {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM Books`; // Replace with your actual table name

    const request = connection.request();
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset.map
    (
      (row) => new Book(row.id, row.title, row.author)
    ); // Convert rows to Book objects
  }
 
  //getBookById: This method retrieves a specific book by its ID using a parameterized query to prevent SQL injection vulnerabilities. It takes an id parameter, connects to the database, executes the query with the provided ID, and returns either a Book object if found or null if not found. It also closes the connection upon completion.
  static async getBookById(id) 
  {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM Books WHERE id = @id`; // Parameterized query

    const request = connection.request();
    request.input("id", id);
    const result = await request.query(sqlQuery);

    
    connection.close();

    return result.recordset[0]
      ? new Book
        (
          result.recordset[0].id, // Accessing the "id" property from the first row
          result.recordset[0].title, // Accessing the "title" property from the first row
          result.recordset[0].author // Accessing the "author" property from the first row
        )
      : null; // Handle book not found
  }

  //createBook allows creation of a book by providing a new ID.
  static async createBook(newBookData) 
  {
    //const connection = await sql.connect(dbConfig);: This line establishes a connection to the database using the mssql package and the configuration defined in dbConfig.
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `INSERT INTO Books (title, author) VALUES (@title, @author); SELECT SCOPE_IDENTITY() AS id;`; // Retrieve ID of inserted record

    const request = connection.request();
    request.input("title", newBookData.title);
    request.input("author", newBookData.author);

    const result = await request.query(sqlQuery);

    connection.close();

    // Retrieve the newly created book using its ID
    return this.getBookById(result.recordset[0].id);
  }

  //Modify existing book data in the database.
  static async updateBookAvailability(id, availabilityStatus)
  {

    //This line establishes a connection to the database using the mssql package and the configuration defined in dbConfig.

    const connection = await sql.connect(dbConfig);

    //This line defines the SQL query string for updating a book record. It uses parameterized queries with placeholders (@title, @author, @id) to prevent SQL injection vulnerabilities.

    const sqlQuery = `UPDATE Books SET title = @title, author = @author WHERE id = @id`; // Parameterized query

    const request = connection.request();
    request.input("id", id); //This line sets the value for the @id parameter in the query using the provided id value.
    //This line sets the value for the @title parameter. It uses the optional chaining operator (||) to check if newBookData.title exists. If it does, it sets the parameter value. Otherwise, it sets it to null to handle optional updates. The same approach is used for @author.
    request.input("title", availabilityStatus.title); // Handle optional fields
    request.input("author", availabilityStatus.author);

    await request.query(sqlQuery); //This line asynchronously executes the prepared SQL query with the set parameters.


    connection.close(); //This line closes the database connection to release resources.


    return this.getBookById(id); // returning the updated book data
  }
 
  //Finds the book by ID, removes it from the books array using splice, and returns true for success or false if the book is not found.
  static async deleteBook(id) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `DELETE FROM Books WHERE id = @id`; // Parameterized query

    const request = connection.request();
    request.input("id", id);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.rowsAffected > 0; // Indicate success based on affected rows
  }

}

//module.exports is a special object that allows you to export values (functions, variables, classes) from your module file to be used in other parts of your application.
module.exports = Book;

//result.recordset property holds the actual data retrieved from your SQL Server database after executing a query. It's a core aspect of interacting with query results:
//result.recordset provides the essential data extracted from the database. You can iterate through this array to process each row of results and extract the desired information.
//SCOPE_IDENTITY() is a Transact-SQL function that retrieves the identity value generated for the last INSERT statement executed within the same scope (e.g., stored procedure, trigger, or batch).

//request.input method from the mssql package is used to set values for the defined parameters (@id, @title, @author) within the SQL query. This approach promotes security by separating data from the query itself, preventing potential SQL injection attacks.
