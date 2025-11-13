import sqlite3 from 'sqlite3';
const dbPath = './chat.db';

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Conectado ao banco de dados SQLite.');
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender TEXT NOT NULL,
      text TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error("Erro ao criar tabela 'messages':", err.message);
    } else {
      console.log("Tabela 'messages' verificada/criada com sucesso.");
    }
  });
});

db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Conexão com o banco de dados fechada.');
});