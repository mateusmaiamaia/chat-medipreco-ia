import { chatService } from '../services/chat.service.js';

export const chatController = {
  getHistory: async (req, res) => {
    try {
      const userEmail = req.userEmail;
      const history = await chatService.getHistory(userEmail);
      res.status(200).json(history);
    } catch (err) {
      res.status(500).json({ error: "Erro ao buscar histórico." });
    }
  },

  postMessage: async (req, res) => {
    try {
      const { userInput, chatHistory } = req.body;
      const userEmail = req.userEmail;
      
      const aiResponse = await chatService.getNewResponse(userInput, chatHistory, userEmail);
      res.status(200).json({ response: aiResponse });
    } catch (err) {
      console.error("Erro no endpoint /api/chat:", err);
      res.status(500).json({ error: "Ops! Tive um problema técnico para me conectar. Por favor, tente novamente em alguns instantes." });
    }
  },

  deleteHistory: async (req, res) => {
    try {
      const userEmail = req.userEmail;
      await chatService.deleteHistory(userEmail);
      res.status(200).json({ message: "Histórico deletado com sucesso." });
    } catch (err) {
      res.status(500).json({ error: "Erro ao deletar histórico." });
    }
  }
};