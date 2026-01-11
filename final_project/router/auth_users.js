const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    const user = users.find(user => user.username === username);
    return user && user.password === password;  // Check if password matches
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const { username, password } = req.body;  // Expecting username and password in request body

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the user exists and credentials match
  if (isValid(username) && authenticatedUser(username, password)) {
    // Generate JWT token
    const token = jwt.sign({ username }, 'secretkey', { expiresIn: '1h' }); // Use a strong secret key

    // Send the token to the user
    return res.status(200).json({ message: "Login successful", token });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const { isbn } = req.params;  // Get ISBN from URL
  const { review } = req.query;  // Get review from query parameter
  const username = req.user.username;  // Get the username from JWT session (assuming req.user is set)

  if (!review) {
    return res.status(400).json({ message: "Review content is required" });
  }

  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
  }

  // If the user has already posted a review, modify it; otherwise, add a new review
  if (book.reviews && book.reviews[username]) {
    // Modify existing review
    book.reviews[username] = review;
    return res.status(200).json({ message: "Review updated successfully" });
  } else {
    // Add new review
    book.reviews = book.reviews || {};
    book.reviews[username] = review;
    return res.status(201).json({ message: "Review added successfully" });
  }
});


// update a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    //return res.status(300).json({message: "Yet to be implemented"});
    const { isbn } = req.params;  // Get ISBN from URL
    const { review } = req.query;  // Get review from query parameter
    const username = req.user.username;  // Get the username from JWT session (assuming req.user is set)
  
    if (!review) {
      return res.status(400).json({ message: "Review content is required" });
    }
  
    const book = books[isbn];
    if (!book) {
      return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
    }
  
    // If the user has already posted a review, modify it; otherwise, add a new review
    if (book.reviews && book.reviews[username]) {
      // Modify existing review
      book.reviews[username] = review;
      return res.status(200).json({ message: "Review updated successfully" });
    } else {
      // Add new review
      book.reviews = book.reviews || {};
      book.reviews[username] = review;
      return res.status(201).json({ message: "Review added successfully" });
    }
  });
  

  
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.authenticatedUser = authenticatedUser;
