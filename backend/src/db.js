const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const DB_PATH = process.env.DB_PATH || path.join(__dirname, "data", "mindtechiot.sqlite");

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("Erro ao conectar ao SQLite:", err.message);
    process.exit(1);
  }
  console.log("Conectado ao SQLite", DB_PATH);
});

db.run(
  `
  CREATE TABLE IF NOT EXISTS subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT (datetime('now','localtime'))
  )
`,
  (err) => {
    if (err) {
      console.error("Erro ao criar tabela:", err.message);
    } else {
      console.log("Tabela subscribers pronta.");
    }
  }
);

module.exports = db;
