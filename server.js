const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const PORT = 3000;

const db = new sqlite3.Database('./db/database.db');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Get all categories
app.get('/api/categories', (req, res) => {
  db.all('SELECT * FROM categories', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get products by category ID
app.get('/api/products/:categoryId', (req, res) => {
  const categoryId = req.params.categoryId;
  db.all('SELECT * FROM products WHERE category_id = ?', [categoryId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Search products
app.get('/api/search', (req, res) => {
  const keyword = `%${req.query.keyword}%`;
  db.all('SELECT * FROM products WHERE name LIKE ? OR description LIKE ?', [keyword, keyword], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});