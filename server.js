const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // ถ้าใช้ public folder

const db = new sqlite3.Database('./Database/database.db');

// ✅ ดึงสินค้าทั้งหมด
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ✅ ดึงสินค้าตามหมวดหมู่
app.get('/api/products/category/:category', (req, res) => {
  const { category } = req.params;
  db.all('SELECT * FROM products WHERE category = ?', [category], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
// การค้นหาสินค้าจากคำค้น
app.get('/api/products/search', (req, res) => {
  const { search } = req.query;  // รับค่า search จาก URL
  const query = `SELECT * FROM products WHERE name LIKE ? OR description LIKE ?`;
  
  // ค้นหาจากชื่อหรือคำอธิบาย
  db.all(query, [`%${search}%`, `%${search}%`], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
// เพิ่มสินค้า
app.post('/api/products', (req, res) => {
  const { name, description, price, category, image } = req.body;
  const query = `INSERT INTO products (name, description, price, category, image) VALUES (?, ?, ?, ?, ?)`;

  db.run(query, [name, description, price, category, image], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, name, description, price, category, image });
  });
});

// แก้ไขสินค้า
app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, image } = req.body;
  const query = `UPDATE products SET name = ?, description = ?, price = ?, category = ?, image = ? WHERE id = ?`;

  db.run(query, [name, description, price, category, image, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'Product updated', id });
  });
});

// ลบสินค้า
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM products WHERE id = ?`;

  db.run(query, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'Product deleted', id });
  });
});


