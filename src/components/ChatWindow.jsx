import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown'; 

function ChatWindow({ messages, isLoading }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="chat-window">
      <div className="messages-list">
        {messages.map((msg, index) => (
          <div key={index} className={`message-bubble ${msg.sender}`}>
            {msg.sender === 'ia' ? (
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            ) : (
              <p>{msg.text}</p>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="message-bubble ia">
            <p><i>Digitando...</i></p>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

export default ChatWindow;