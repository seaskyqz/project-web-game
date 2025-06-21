console.log("🔥 เริ่มอัปเดตสินค้า...");

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/database.db');

const updates = [
  { id: 1, name: "Elden Ring", image: "eldenring.jpg" },
  { id: 2, name: "Genshin Impact", image: "genshin.jpg" },
  { id: 3, name: "God of War: Ragnarok", image: "gowragnarok.jpg" },
  { id: 4, name: "Hogwarts Legacy", image: "hogwarts.jpg" },
  { id: 5, name: "Assassin's Creed Mirage", image: "acmirage.jpg" },
  { id: 6, name: "Call of Duty: MW3", image: "codmw3.jpg" },
  { id: 7, name: "Cyberpunk 2077", image: "cyberpunk.jpg" },
  { id: 8, name: "Final Fantasy XVI", image: "ffxvi.jpg" },
  { id: 9, name: "The Legend of Zelda: TOTK", image: "zelda_totk.jpg" },
  { id: 10, name: "Apex Legends", image: "apex.jpg" }
];

updates.forEach(prod => {
  db.run(
    `UPDATE products SET name = ?, image = ? WHERE id = ?`,
    [prod.name, prod.image, prod.id],
    function (err) {
      if (err) return console.error("❌ Error:", err.message);
      console.log(`✅ Updated product ID ${prod.id} to "${prod.name}"`);
    }
  );
});

db.close();
