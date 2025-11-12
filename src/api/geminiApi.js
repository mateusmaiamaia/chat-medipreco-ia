import { GoogleGenerativeAI } from "@google/generative-ai";
import { CONTEXTO_MEDIPRECO } from "./contexto.js"; 

const API_KEY = "AIzaSyAE9nT55CdkWzGMQhQScgqCWXa9ZKNsBL0";

const genAI = new GoogleGenerativeAI(API_KEY);

export async function getGeminiResponse(userInput, chatHistory) {
  
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const systemInstruction = `
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
    Se a pergunta do usuário não puder ser respondida pelo contexto (ex: "qual o valor da ação da Medipreço?" ou "como faço para ser estudante?"), você DEVE responder de forma amigável:
    "Puxa, essa informação específica eu não tenho aqui. Meu foco é ajudar com dúvidas sobre nossos produtos e serviços, como subsídios, entregas e o uso do app. Posso te ajudar com algo nesse sentido?"
  `;

  try {
    const history = chatHistory.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const chat = model.startChat({
      history: history,
      systemInstruction: {
        role: "system",
        parts: [{ text: systemInstruction }]
      },
    });

    const result = await chat.sendMessage(userInput);
    const response = await result.response;
    const text = response.text();
    return text;

  } catch (error) {
    console.error("Erro na API do Gemini:", error);
    return "Ops! Tive um problema técnico para me conectar. Por favor, tente novamente em alguns instantes.";
  }
}