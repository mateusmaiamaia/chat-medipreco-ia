import pg from 'pg';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const { Pool } = pg;

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

async function query(text, params) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('executed query', { text, duration, rows: res.rowCount });
  return res;
}

async function createTables() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        hashedPassword TEXT NOT NULL,
        name TEXT
      )
    `);
    console.log("Tabela 'users' verificada/criada.");

    const defaultEmail = 'teste@medipreco.com';
    const defaultName = 'Usuário Teste';
    const defaultPassword = '123';
    const hashedPassword = bcrypt.hashSync(defaultPassword, 8);

    const res = await query(
      `INSERT INTO users (email, hashedPassword, name) VALUES ($1, $2, $3)
       ON CONFLICT (email) DO NOTHING`,
      [defaultEmail, hashedPassword, defaultName]
    );
    
    if (res.rowCount > 0) {
      console.log("Usuário padrão 'teste@medipreco.com' criado.");
    } else {
      console.log("Usuário padrão 'teste@medipreco.com' já existe.");
    }

    await query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        sender TEXT NOT NULL,
        text TEXT NOT NULL,
        "timestamp" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        "userEmail" TEXT NOT NULL REFERENCES users(email)
      )
    `);
    console.log("Tabela 'messages' verificada/criada.");
  } catch (err) {
    console.error("Erro ao criar tabelas:", err.message);
    throw err;
  }
}

export const connectDb = async () => {
  let retries = 5;
  while (retries) {
    try {
      const client = await pool.connect();
      console.log("Conectado ao banco de dados PostgreSQL.");
      await createTables();
      client.release();
      console.log("Banco de dados inicializado com sucesso.");
      return;
    } catch (err) {
      console.error("Falha ao conectar ao DB, tentando novamente...", err.message);
      retries -= 1;
      await new Promise(res => setTimeout(res, 5000));
    }
  }
  console.error("Não foi possível conectar ao banco de dados após 5 tentativas.");
  process.exit(1);
};

export const getPool = () => pool;