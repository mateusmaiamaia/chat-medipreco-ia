import React, { useState } from 'react';

function InputBar({ onSendMessage, isLoading }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onSendMessage(text);
      setText('');
    }
  };

  return (
    <form className="input-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={isLoading ? "Aguarde..." : "Digite sua dúvida..."}
        disabled={isLoading}
      />
      <button type="submit" disabled={isLoading}>
        Enviar
      </button>
    </form>
  );
}

export default InputBar;