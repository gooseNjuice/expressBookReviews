const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Helper function to get the base URL dynamically
const getBaseUrl = (req) => {
  return `${req.protocol}://${req.get('host')}`;
};

// Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists." });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User successfully registered." });
});

// Get the list of all books using async/await
public_users.get('/async', async (req, res) => {
  try {
    const response = await axios.get(`${getBaseUrl(req)}/`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(404).json({ message: "Error fetching books" });
  }
});

// Get book details by ISBN using async/await
public_users.get('/async/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`${getBaseUrl(req)}/isbn/${isbn}`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(404).json({ message: "Book not found" });
  }
});

// Get books by author using async/await
public_users.get('/async/author/:author', async (req, res) => {
  const author = req.params.author;
  try {
    const response = await axios.get(`${getBaseUrl(req)}/author/${author}`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(404).json({ message: "No books found for the given author." });
  }
});

// Get books by title using async/await
public_users.get('/async/title/:title', async (req, res) => {
  const title = req.params.title;
  try {
    const response = await axios.get(`${getBaseUrl(req)}/title/${title}`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(404).json({ message: "No books found for the given title." });
  }
});

// Get the list of all books
public_users.get('/', async (req, res) => {
  try {
    res.status(200).json(books);
  } catch (error) {
    res.status(404).json({ message: "No books available" });
  }
});

// Get book details by ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const book = books[isbn];
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving book" });
  }
});

// Get books by author
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;
  try {
    const filteredBooks = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());
    if (filteredBooks.length > 0) {
      res.status(200).json(filteredBooks);
    } else {
      res.status(404).json({ message: "No books found for the given author." });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books" });
  }
});

// Get books by title
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title;
  try {
    const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());
    if (filteredBooks.length > 0) {
      res.status(200).json(filteredBooks);
    } else {
      res.status(404).json({ message: "No books found for the given title." });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books" });
  }
});

// Get book reviews by ISBN
public_users.get('/review/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const book = books[isbn];
    if (book) {
      res.status(200).json(book.reviews);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving reviews" });
  }
});

module.exports.general = public_users;
