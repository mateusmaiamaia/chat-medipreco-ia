import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { getGeminiResponse } from './geminiApi.js';
import { connectDb, getPool } from './db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'seu-segredo-super-secreto-padrao';

app.use(cors()); 
app.use(express.json()); 

const pool = getPool();

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Nome, e-mail e senha são obrigatórios." });
  }

  const hashedPassword = bcrypt.hashSync(password, 8);

  try {
    await pool.query(
      "INSERT INTO users (name, email, hashedPassword) VALUES ($1, $2, $3)",
      [name, email, hashedPassword]
    );
    res.status(201).json({ message: "Usuário registrado com sucesso." });
  } catch (err) {
    if (err.code === '23505') { 
      return res.status(409).json({ error: "Este e-mail já está em uso." });
    }
    console.error(err);
    return res.status(500).json({ error: "Erro ao registrar usuário." });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email e senha são obrigatórios." });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.hashedpassword);
    if (!passwordIsValid) {
      return res.status(401).json({ error: "Senha inválida." });
    }

    const token = jwt.sign({ email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '24h' });
    res.status(200).json({ token: token, email: user.email, name: user.name });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro no servidor." });
  }
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

    await pool.query(
      "INSERT INTO messages (sender, text, \"userEmail\") VALUES ($1, $2, $3)",
      ['user', userMessage, userEmail]
    );
    await pool.query(
      "INSERT INTO messages (sender, text, \"userEmail\") VALUES ($1, $2, $3)",
      ['ia', iaMessage, userEmail]
    );
    
    res.json({ response: aiResponse });
  } catch (error) {
    console.error("Erro no endpoint /api/chat:", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

app.get('/api/chat/history', authenticateToken, async (req, res) => {
  try {
    const userEmail = req.userEmail;
    
    const result = await pool.query(
      "SELECT sender, text FROM messages WHERE \"userEmail\" = $1 ORDER BY timestamp ASC", 
      [userEmail]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Erro no endpoint /api/chat/history:", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

app.delete('/api/chat/history', authenticateToken, async (req, res) => {
  try {
    const userEmail = req.userEmail;
    await pool.query("DELETE FROM messages WHERE \"userEmail\" = $1", [userEmail]);
    res.status(200).json({ message: "Histórico deletado com sucesso." });
  } catch (error) {
    console.error("Erro no endpoint /api/chat/history (DELETE):", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

const startServer = async () => {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.log(`🚀 Servidor backend rodando na porta ${PORT}`);
    });
  } catch (err) {
    console.error("Falha ao iniciar o servidor:", err);
    process.exit(1);
  }
};

startServer();