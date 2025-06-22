const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./Database/database.db');

db.serialize(() => {
  db.run(`DROP TABLE IF EXISTS products`);
  db.run(`CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT,
    price REAL,
    category TEXT,
    image TEXT
  )`);

  const stmt = db.prepare(`INSERT INTO products (name, description, price, category, image) VALUES (?, ?, ?, ?, ?)`);
  stmt.run("Cyberpunk 2077", "Open world RPG", 1599, "RPG", "images/cyberpunk.jpg");
stmt.run("Call of Duty", "Action shooter", 1299, "Action", "images/cod.jpg");
stmt.run("Stardew Valley", "Farming sim", 299, "Simulation", "images/stardew.jpg");

  stmt.finalize();
});

db.close(() => {
  console.log("✅ Database initialized.");
});
