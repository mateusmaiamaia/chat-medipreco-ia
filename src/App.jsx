import React, { useState } from 'react';
import ChatWindow from './components/ChatWindow';
import InputBar from './components/InputBar';
import { getGeminiResponse } from './api/geminiApi';

function App() {
  const [messages, setMessages] = useState([
    { sender: 'ia', text: 'Olá! Eu sou o assistente da Medipreço. Como posso ajudar você hoje?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (userInput) => {
    const userMessage = { sender: 'user', text: userInput };
    setMessages(prevMessages => [...prevMessages, userMessage]);

    setIsLoading(true);

    try {
      const history = messages.slice(1);
      const iaResponseText = await getGeminiResponse(userInput, history); 
      const iaMessage = { sender: 'ia', text: iaResponseText };
      setMessages(prevMessages => [...prevMessages, iaMessage]);

    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      const errorMessage = { sender: 'ia', text: 'Desculpe, algo deu errado.' };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    }

    setIsLoading(false);
  };

  return (
    <div className="chat-container">
      <ChatWindow messages={messages} isLoading={isLoading} />
      <InputBar onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}

export default App;