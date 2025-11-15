import { messageRepository } from '../repositories/message.repository.js';
import { getGeminiResponse } from './gemini.service.js';

export const chatService = {
  getHistory: async (userEmail) => {
    return messageRepository.getHistoryByEmail(userEmail);
  },

  deleteHistory: async (userEmail) => {
    return messageRepository.deleteHistoryByEmail(userEmail);
  },

  getNewResponse: async (userInput, chatHistory, userEmail) => {
    const aiResponse = await getGeminiResponse(userInput, chatHistory);

    try {
      await messageRepository.create('user', userInput, userEmail);
      await messageRepository.create('ia', aiResponse, userEmail);
    } catch (dbError) {
      console.error("Erro ao salvar mensagem no banco de dados:", dbError);
    }

    return aiResponse;
  }
};