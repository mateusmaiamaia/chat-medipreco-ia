import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { getGeminiResponse } from './geminiApi.js';

const app = express();
const PORT = process.env.PORT || 3001; 

app.use(cors()); 
app.use(express.json()); 

app.post('/api/chat', async (req, res) => {
  try {
    const { userInput, chatHistory } = req.body;

    const aiResponse = await getGeminiResponse(userInput, chatHistory);

    res.json({ response: aiResponse });

  } catch (error) {
    console.error("Erro no endpoint /api/chat:", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend rodando na porta ${PORT}`);
});