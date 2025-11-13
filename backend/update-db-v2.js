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
    ALTER TABLE users 
    ADD COLUMN name TEXT
  `, (err) => {
    if (err) {
      if (err.message.includes("duplicate column name")) {
        console.log("Coluna 'name' já existe. Nenhuma alteração feita.");
      } else {
        console.error("Erro ao adicionar coluna 'name':", err.message);
      }
    } else {
      console.log("Coluna 'name' adicionada com sucesso.");
    }
  });
});

db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Conexão com o banco de dados fechada.');
});