const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const PORT = 3000;

// ใช้ JSON middleware
app.use(express.json());
app.use(cors()); // สำหรับการเข้าถึง API จาก frontend
app.use(express.static(__dirname + '/public')); // ใช้ middleware เพื่อให้บริการไฟล์สถิติ

// เชื่อมต่อกับฐานข้อมูล SQLite
const db = new sqlite3.Database('./Database/database.db');

// ตรวจสอบและสร้างตารางถ้ายังไม่มี
db.serialize(() => {
  // สร้างตาราง categories
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL
    )
  `);

  // สร้างตาราง products
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL,
      category TEXT,
      image TEXT
    )
  `);

  // เพิ่มหมวดหมู่เริ่มต้น
  const initialCategories = ['RPG', 'Action', 'OpenWorld', 'Strategy', 'Adventure'];
  initialCategories.forEach(category => {
    db.run(`INSERT OR IGNORE INTO categories (name) VALUES (?)`, [category]);
  });
});

// --------------- API สำหรับเพิ่มสินค้า ---------------
app.post('/api/products', (req, res) => {
  const { name, description, price, category, image } = req.body;
  const query = `INSERT INTO products (name, description, price, category, image) VALUES (?, ?, ?, ?, ?)`;

  db.run(query, [name, description, price, category, image], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, name, description, price, category, image });
  });
});

// --------------- API สำหรับแก้ไขสินค้า ---------------
app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, image } = req.body;
  const query = `UPDATE products SET name = ?, description = ?, price = ?, category = ?, image = ? WHERE id = ?`;

  db.run(query, [name, description, price, category, image, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'Product updated', id });
  });
});

// --------------- API สำหรับลบสินค้า ---------------
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM products WHERE id = ?`;

  db.run(query, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'Product deleted', id });
  });
});

// --------------- API สำหรับดึงข้อมูลสินค้าทั้งหมด ---------------
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// --------------- API สำหรับค้นหาสินค้าตามชื่อ ---------------
app.get('/api/products/search', (req, res) => {
  const { search } = req.query;
  const query = `SELECT * FROM products WHERE name LIKE ? OR description LIKE ?`;

  db.all(query, [`%${search}%`, `%${search}%`], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// --------------- API สำหรับดึงสินค้าตามหมวดหมู่ ---------------
app.get('/api/products/category/:category', (req, res) => {
  const { category } = req.params;
  db.all('SELECT * FROM products WHERE category = ?', [category], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// --------------- API สำหรับดึงข้อมูลสินค้าตาม ID ---------------
app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM products WHERE id = ?`;

  db.get(query, [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ message: 'Product not found' });
    res.json(row);  // ส่งข้อมูลสินค้าเฉพาะตัวที่ต้องการแก้ไข
  });
});

// --------------- API สำหรับเพิ่มหมวดหมู่ใหม่ ---------------
app.post('/api/categories', (req, res) => {
  const { category } = req.body;
  const query = `INSERT INTO categories (name) VALUES (?)`;

  db.run(query, [category], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Category added', id: this.lastID, category });
  });
});

// --------------- API สำหรับดึงหมวดหมู่ทั้งหมด ---------------
app.get('/api/categories', (req, res) => {
  const query = 'SELECT * FROM categories';
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// เริ่มต้น server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
