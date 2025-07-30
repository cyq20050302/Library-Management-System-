// 基础依赖
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL连接
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456', // 修改为你的MySQL密码
  database: 'library'
});

db.connect(err => {
  if (err) {
    console.error('数据库连接失败:', err);
  } else {
    console.log('数据库连接成功');
  }
});

// 用户注册
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length > 0) return res.status(400).json({ error: '用户名已存在' });
    db.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, password, 'user'], (err2) => {
      if (err2) return res.status(500).json({ error: err2 });
      res.json({ success: true });
    });
  });
});

// 用户登录
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(401).json({ error: '用户名或密码错误' });
    res.json({ success: true, user: results[0] });
  });
});

// 获取所有图书
app.get('/books', (req, res) => {
  db.query('SELECT * FROM books', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// 新增图书
app.post('/books', (req, res) => {
  const { title, author, publish_date, status } = req.body;
  db.query('INSERT INTO books (title, author, publish_date, status) VALUES (?, ?, ?, ?)', [title, author, publish_date, status], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
});

// 编辑图书
app.put('/books/:id', (req, res) => {
  const { title, author, publish_date, status } = req.body;
  db.query('UPDATE books SET title=?, author=?, publish_date=?, status=? WHERE id=?', [title, author, publish_date, status, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
});

// 删除图书
app.delete('/books/:id', (req, res) => {
  db.query('DELETE FROM books WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
});

// 获取所有用户
app.get('/users', (req, res) => {
  db.query('SELECT id, username, role FROM users', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// 新增用户
app.post('/users', (req, res) => {
  const { username, role } = req.body;
  db.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, '123456', role], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
});

// 编辑用户
app.put('/users/:id', (req, res) => {
  const { username, role } = req.body;
  db.query('UPDATE users SET username=?, role=? WHERE id=?', [username, role, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
});

// 删除用户
app.delete('/users/:id', (req, res) => {
  db.query('DELETE FROM users WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
});

// 借阅记录
app.get('/borrow', (req, res) => {
  db.query('SELECT b.id, books.title as book_title, users.username, b.borrow_date, b.return_date, b.status FROM borrow b JOIN books ON b.book_id=books.id JOIN users ON b.user_id=users.id', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// 借书
app.post('/borrow', (req, res) => {
  const { book_id, user_id } = req.body;
  db.query('INSERT INTO borrow (book_id, user_id, borrow_date, status) VALUES (?, ?, NOW(), ?)', [book_id, user_id, '借出'], (err) => {
    if (err) return res.status(500).json({ error: err });
    db.query('UPDATE books SET status=? WHERE id=?', ['借出', book_id]);
    res.json({ success: true });
  });
});

// 还书
app.put('/borrow/:id/return', (req, res) => {
  db.query('UPDATE borrow SET return_date=NOW(), status=? WHERE id=?', ['已还', req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    // 同步更新图书状态为在馆
    db.query('SELECT book_id FROM borrow WHERE id=?', [req.params.id], (err2, results) => {
      if (!err2 && results.length > 0) {
        db.query('UPDATE books SET status=? WHERE id=?', ['在馆', results[0].book_id]);
      }
    });
    res.json({ success: true });
  });
});

// 仪表盘统计
app.get('/stats', (req, res) => {
  db.query('SELECT (SELECT COUNT(*) FROM books) as books, (SELECT COUNT(*) FROM users) as users, (SELECT COUNT(*) FROM books WHERE status="借出") as borrowed, (SELECT COUNT(*) FROM books WHERE status="在馆") as inLibrary', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results[0]);
  });
});

app.listen(3000, () => {
  console.log('Node服务已启动：http://localhost:3000');
});

/*
MySQL建表语句：

CREATE DATABASE IF NOT EXISTS library DEFAULT CHARSET utf8mb4;
USE library;

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  role VARCHAR(20) DEFAULT 'user'
);

CREATE TABLE books (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255),
  publish_date DATE,
  status VARCHAR(20) DEFAULT '在馆'
);

CREATE TABLE borrow (
  id INT PRIMARY KEY AUTO_INCREMENT,
  book_id INT,
  user_id INT,
  borrow_date DATETIME,
  return_date DATETIME,
  status VARCHAR(20),
  FOREIGN KEY (book_id) REFERENCES books(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
*/ 