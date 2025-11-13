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
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      hashedPassword TEXT NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error("Erro ao criar tabela 'users':", err.message);
    } else {
      console.log("Tabela 'users' verificada/criada com sucesso.");
    }
  });

  db.run(`
    ALTER TABLE messages 
    ADD COLUMN userEmail TEXT
  `, (err) => {
    if (err) {
      if (err.message.includes("duplicate column name")) {
        console.log("Coluna 'userEmail' já existe. Nenhuma alteração feita.");
      } else {
        console.error("Erro ao adicionar coluna 'userEmail':", err.message);
      }
    } else {
      console.log("Coluna 'userEmail' adicionada com sucesso.");
    }
  });

  db.run(`ALTER TABLE messages DROP COLUMN session_id`, (err) => {
    if (err) {
      if (err.message.includes("no such column")) {
         console.log("Coluna 'session_id' não existe. Nenhuma alteração feita.");
      } else {
         console.log("Coluna 'session_id' removida com sucesso.");
      }
    } else {
      console.log("Coluna 'session_id' removida com sucesso.");
    }
  });
});

db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Conexão com o banco de dados fechada.');
});