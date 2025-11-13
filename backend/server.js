import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { getGeminiResponse } from './geminiApi.js';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const dbPath = './chat.db';
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Erro ao conectar ao DB:", err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite para o servidor.');
  }
});

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'seu-segredo-super-secreto-padrao';

if (JWT_SECRET === 'seu-segredo-super-secreto-padrao') {
  console.warn("Atenção: JWT_SECRET não está definida no .env. Usando um segredo padrão.");
}

app.use(cors()); 
app.use(express.json()); 

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Nome, e-mail e senha são obrigatórios." });
  }

  const hashedPassword = bcrypt.hashSync(password, 8);

  db.run("INSERT INTO users (name, email, hashedPassword) VALUES (?, ?, ?)", [name, email, hashedPassword], function(err) {
    if (err) {
      if (err.message.includes("UNIQUE constraint failed")) {
        return res.status(409).json({ error: "Este e-mail já está em uso." });
      }
      return res.status(500).json({ error: "Erro ao registrar usuário." });
    }
    res.status(201).json({ message: "Usuário registrado com sucesso." });
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email e senha são obrigatórios." });
  }

  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (err) {
      return res.status(500).json({ error: "Erro no servidor." });
    }
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.hashedPassword);
    if (!passwordIsValid) {
      return res.status(401).json({ error: "Senha inválida." });
    }

    const token = jwt.sign({ email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '24h' });
    res.status(200).json({ token: token, email: user.email, name: user.name });
  });
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 
  if (token == null) return res.sendStatus(401); 

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); 
    req.userEmail = user.email; 
    next();
  });
};

app.post('/api/chat', authenticateToken, async (req, res) => {
  try {
    const { userInput, chatHistory } = req.body;
    const userEmail = req.userEmail; 

    const aiResponse = await getGeminiResponse(userInput, chatHistory);
    const userMessage = userInput;
    const iaMessage = aiResponse;

    const stmt = db.prepare("INSERT INTO messages (sender, text, userEmail) VALUES (?, ?, ?)");
    stmt.run('user', userMessage, userEmail);
    stmt.run('ia', iaMessage, userEmail);
    stmt.finalize();
    
    res.json({ response: aiResponse });

  } catch (error) {
    console.error("Erro no endpoint /api/chat:", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

app.get('/api/chat/history', authenticateToken, (req, res) => {
  try {
    const userEmail = req.userEmail;
    
    db.all("SELECT sender, text FROM messages WHERE userEmail = ? ORDER BY timestamp ASC", [userEmail], (err, rows) => {
      if (err) {
        console.error("Erro ao buscar histórico:", err.message);
        res.status(500).json({ error: "Erro ao buscar histórico." });
        return;
      }
      res.json(rows);
    });
  } catch (error) {
    console.error("Erro no endpoint /api/chat/history:", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

app.delete('/api/chat/history', authenticateToken, (req, res) => {
  try {
    const userEmail = req.userEmail;

    db.run("DELETE FROM messages WHERE userEmail = ?", [userEmail], function(err) {
      if (err) {
        console.error("Erro ao deletar histórico:", err.message);
        res.status(500).json({ error: "Erro ao deletar histórico." });
        return;
      }
      res.status(200).json({ message: "Histórico deletado com sucesso." });
    });
  } catch (error) {
    console.error("Erro no endpoint /api/chat/history (DELETE):", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend rodando na porta ${PORT}`);
});