import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';

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
      hashedPassword TEXT NOT NULL,
      name TEXT
    )
  `, (err) => {
    if (err) {
      console.error("Erro ao criar tabela 'users':", err.message);
    } else {
      console.log("Tabela 'users' verificada/criada com sucesso.");
      
      const defaultEmail = 'teste@medipreco.com';
      const defaultName = 'Usuário Teste';
      const defaultPassword = '123';
      const hashedPassword = bcrypt.hashSync(defaultPassword, 8);

      db.run(
        `INSERT OR IGNORE INTO users (email, hashedPassword, name) VALUES (?, ?, ?)`,
        [defaultEmail, hashedPassword, defaultName],
        function(err) {
          if (err) {
            console.error("Erro ao inserir usuário padrão:", err.message);
          } else if (this.changes > 0) {
            console.log("Usuário padrão 'teste@medipreco.com' criado com sucesso.");
          } else {
            console.log("Usuário padrão 'teste@medipreco.com' já existe.");
          }
        }
      );
    }
  });

  db.run(`ALTER TABLE messages ADD COLUMN userEmail TEXT`, (err) => {
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