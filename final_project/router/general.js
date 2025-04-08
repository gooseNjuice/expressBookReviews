const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Регистрация нового пользователя
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists." });
  }

  // Добавляем нового пользователя
  users.push({ username, password });
  return res.status(201).json({ message: "User successfully registered." });
});

// Получить список всех книг
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});

// Получить информацию о книге по ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found." });
  }
});

// Получить книги по автору
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const filteredBooks = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());

  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  } else {
    return res.status(404).json({ message: "No books found for the given author." });
  }
});

// Получить книги по названию
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());

  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  } else {
    return res.status(404).json({ message: "No books found for the given title." });
  }
});

// Получить отзывы о книге по ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found." });
  }
});

module.exports.general = public_users;
