import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { getGeminiResponse } from './geminiApi.js';
import sqlite3 from 'sqlite3';

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

app.use(cors()); 
app.use(express.json()); 

app.post('/api/chat', async (req, res) => {
  try {
    const { userInput, chatHistory } = req.body;
    const aiResponse = await getGeminiResponse(userInput, chatHistory);

    const userMessage = userInput;
    const iaMessage = aiResponse;

    const stmt = db.prepare("INSERT INTO messages (sender, text) VALUES (?, ?)");
    stmt.run('user', userMessage);
    stmt.run('ia', iaMessage);
    stmt.finalize();
    
    res.json({ response: aiResponse });

  } catch (error) {
    console.error("Erro no endpoint /api/chat:", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend rodando na porta ${PORT}`);
});