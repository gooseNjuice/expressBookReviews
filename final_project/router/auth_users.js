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
  return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;

  // Проверка наличия имени пользователя и пароля
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Проверка аутентификации
  if (authenticatedUser(username, password)) {
    // Генерация JWT токена
    let accessToken = jwt.sign({ username }, 'access', { expiresIn: '1h' });

    // Сохранение токена в сессии
    req.session.authorization = { accessToken, username };
    return res.status(200).json({ message: "User successfully logged in" });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization?.username;

  // Проверка аутентификации
  if (!username) {
    return res.status(403).json({ message: "User not authenticated" });
  }

  // Проверка наличия книги
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Добавление или обновление отзыва
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  books[isbn].reviews[username] = review;
  return res.status(200).json({ message: `Review for book with ISBN ${isbn} has been added/updated.` });
});

// Удаление отзыва о книге
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization?.username;

  // Проверка аутентификации
  if (!username) {
    return res.status(403).json({ message: "User not authenticated" });
  }

  // Проверка наличия книги
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Удаление отзыва пользователя
  if (books[isbn].reviews && books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: `Review by user ${username} for book with ISBN ${isbn} has been deleted.` });
  } else {
    return res.status(404).json({ message: "Review not found or not owned by the user." });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
