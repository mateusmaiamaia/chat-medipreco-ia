import { GoogleGenerativeAI } from "@google/generative-ai";
import { CONTEXTO_MEDIPRECO } from "./contexto.js";
import 'dotenv/config'; 

const API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);

export async function getGeminiResponse(userInput, chatHistory) {
  
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash-lite",
    systemInstruction: `
      Você é um assistente de atendimento da Medipreço.
      Seu objetivo é responder dúvidas sobre a empresa com um tom humano, 
      amigável e natural, como no exemplo. Evite ser robótico.
      Use a primeira pessoa do plural (ex: "A gente tem...", "Nós oferecemos...").

      Exemplo de tom:
      Usuário: "Quais os planos da Medipreço?"
      IA: "A gente tem quatro planos principais! O Medi 45, com descontos direto na farmácia; o Medi 90, que oferece saldo mensal para medicamentos; o Medi 180, com acesso à telemedicina 24/7; e o Medi 360, que dá acesso ao nosso clube de descontos em saúde, bem-estar e até entretenimento. Se quiser, posso te explicar cada um com mais detalhes!" 
      
      ### REGRA DE FORMATAÇÃO ###
      Use Markdown para melhorar a legibilidade.
      - Para listas, use bullet points (com *) ou listas numeradas (1., 2.).
      - Para termos importantes, use **negrito** (com **texto**).
      
      BASE DE CONHECIMENTO OBRIGATÓRIA:
      ---
      ${CONTEXTO_MEDIPRECO}
      ---
      
      ### REGRA DE FALHA (MUITO IMPORTANTE) ###
      Responda TODAS as perguntas do usuário usando APENAS o contexto acima.
      NUNCA invente informações. 
      Se a pergunta do usuário não puder ser respondida pelo contexto (ex: "quanto custa um carro?"), você DEVE responder de forma amigável:
      "Não entendi sua mensagem. 😥 Mas não se preocupe, meu foco é ajudar com dúvidas sobre nossos produtos e serviços. Posso te ajudar com algum dos tópicos abaixo?"
    `
  });

  try {
    // Garante que o histórico está no formato correto
    const history = chatHistory.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // Verifica se há histórico e se a primeira mensagem é do usuário
    if (history.length > 0 && history[0].role !== 'user') {
      // Se a primeira mensagem não for do usuário, remove ou ajusta
      console.warn("Primeira mensagem do histórico não é do usuário. Ajustando...");
      // Opção 1: Remove a primeira mensagem se não for do usuário
      const adjustedHistory = history.filter((msg, index) => 
        index === 0 ? msg.role === 'user' : true
      );
      
      // Se após ajuste o array estiver vazio, usa array vazio
      const finalHistory = adjustedHistory.length > 0 ? adjustedHistory : [];
      
      const chat = model.startChat({
        history: finalHistory,
      });

      const result = await chat.sendMessage(userInput);
      const response = await result.response;
      const text = response.text();
      return text;
    } else {
      // Histórico já está correto ou está vazio
      const chat = model.startChat({
        history: history,
      });

      const result = await chat.sendMessage(userInput);
      const response = await result.response;
      const text = response.text();
      return text;
    }

  } catch (error) {
    console.error("Erro na API do Gemini:", error);
    
    // Fallback mais robusto
    if (error.message?.includes("First content should be with role 'user'")) {
      console.log("Tentando sem histórico devido a erro de role...");
      // Tenta novamente sem histórico
      try {
        const chat = model.startChat({
          history: [], // Array vazio para garantir
        });
        const result = await chat.sendMessage(userInput);
        const response = await result.response;
        const text = response.text();
        return text;
      } catch (fallbackError) {
        return "Ops! Tive um problema técnico. Por favor, tente novamente em alguns instantes.";
      }
    }
    
    return "Ops! Tive um problema técnico para me conectar. Por favor, tente novamente em alguns instantes.";
  }
}