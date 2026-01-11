const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Please provide both username and password" });
  }
  if (users.some(user => user.username === username)) {
    return res.status(400).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
      const booksList = await getBooks(); 
      return res.status(200).json({ books: booksList });
    } catch (error) {
      return res.status(500).json({ message: "Error fetching books", error: error.message });
    }
  });

async function getBooks() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(books); 
      }, 1000); 
    });
  }

// Get book details based on ISBN (with async/await)
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
      const isbn = req.params.isbn;
      const book = await getBookByISBN(isbn); 
      if (!book) {
        return res.status(404).json({ message: 'Book with ISBN ${isbn} not found' });
      }
      return res.status(200).json({ book });
    } catch (error) {
      return res.status(500).json({ message: "Error fetching book details", error: error.message });
    }
  });
  
  // Example of an async function to fetch book by ISBN
  async function getBookByISBN(isbn) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const book = books[isbn];
        resolve(book); 
      }, 1000); 
    });
  }
  
// Get book details based on author (with async/await)
public_users.get('/author/:author', async function (req, res) {
    try {
      const author = req.params.author;
      const booksByAuthor = await getBooksByAuthor(author); 
      if (booksByAuthor.length === 0) {
        return res.status(404).json({ message: `No books found by author ${author}` });
      }
      return res.status(200).json({ books: booksByAuthor });
    } catch (error) {
      return res.status(500).json({ message: "Error fetching books by author", error: error.message });
    }
  });
  
  // Example async function to get books by author
  async function getBooksByAuthor(author) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const filteredBooks = Object.values(books).filter(book => 
          book.author.toLowerCase() === author.toLowerCase());
        resolve(filteredBooks); 
      }, 1000); 
    });
  }

// Get all books based on title (with async/await)
public_users.get('/title/:title', async function (req, res) {
    try {
      const title = req.params.title;
      const booksByTitle = await getBooksByTitle(title); 
      if (booksByTitle.length === 0) {
        return res.status(404).json({ message: `No books found with title ${title}` });
      }
      return res.status(200).json({ books: booksByTitle });
    } catch (error) {
      return res.status(500).json({ message: "Error fetching books by title", error: error.message });
    }
  });
  
  // Example async function to get books by title
  async function getBooksByTitle(title) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const filteredBooks = Object.values(books).filter(book => 
          book.title.toLowerCase() === title.toLowerCase());
        resolve(filteredBooks); 
      }, 1000); 
    });
  }

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: 'Book with ISBN ${isbn} not found' });
  }
  return res.status(200).json({ reviews: book.reviews || [] });
});

module.exports.general = public_users;
