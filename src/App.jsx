import React, { useState } from 'react';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import InputBar from './components/InputBar';

function App() {
  const [messages, setMessages] = useState([
    { sender: 'ia', text: 'Olá! Eu sou o assistente da Medipreço. Como posso ajudar você hoje?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (userInput) => {
    const userMessage = { sender: 'user', text: userInput };
    const history = messages.slice(1);
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      const API_URL = 'http://localhost:3001/api/chat';

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userInput: userInput,
          chatHistory: history
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao conectar com o backend.');
      }

      const data = await response.json();
      const iaMessage = { sender: 'ia', text: data.response };
      setMessages(prevMessages => [...prevMessages, iaMessage]);

    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      const errorMessage = { sender: 'ia', text: 'Desculpe, algo deu errado ao conectar.' };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    }

    setIsLoading(false);
  };

  return (
    <div className="chat-container">
      <Header />
      <ChatWindow messages={messages} isLoading={isLoading} />
      <InputBar onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}

export default App;