const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('conveyor.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS results (
    id INTEGER PRIMARY KEY,
    unusedA INTEGER,
    unusedB INTEGER,
    productsC INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

function saveResults(unusedA, unusedB, productsC) {
  db.run(`INSERT INTO results (unusedA, unusedB, productsC) VALUES (?, ?, ?)`, 
    [unusedA, unusedB, productsC]);
}