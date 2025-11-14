import { Router } from 'express';
import { getPool } from '../db.js';
import { getGeminiResponse } from '../geminiApi.js';

const router = Router();
const pool = getPool();

router.post('/', async (req, res) => {
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

router.get('/history', async (req, res) => {
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

router.delete('/history', async (req, res) => {
  try {
    const userEmail = req.userEmail;
    await pool.query("DELETE FROM messages WHERE \"userEmail\" = $1", [userEmail]);
    res.status(200).json({ message: "Histórico deletado com sucesso." });
  } catch (error) {
    console.error("Erro no endpoint /api/chat/history (DELETE):", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

export default router;