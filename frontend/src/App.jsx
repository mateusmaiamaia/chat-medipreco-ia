import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import InputBar from './components/InputBar';
import SuggestionChips from './components/SuggestionChips';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const API_URL = '/api';

const CHIP_SET_RESCUE = ["Ver tópicos de ajuda"];
const CHIP_SET_MAIN_TOPICS = [
  "Planos Medipreço",
  "Diferenciais",
  "Dúvidas do App",
  "Como funciona o Subsídio?",
  "O que são Smart Lockers?",
  "Prazos de Entrega",
  "Pagamentos e Estornos",
  "Regras de Receitas",
  "Trocas e Devoluções",
  "MediPet (Petlove)",
  "Canais de Atendimento"
];

function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [token, setToken] = useState(localStorage.getItem('chatToken'));
  const [userName, setUserName] = useState(localStorage.getItem('chatUserName'));

  const [isLoginView, setIsLoginView] = useState(true);
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [chipSetToShow, setChipSetToShow] = useState(CHIP_SET_RESCUE);

  const getWelcomeMessage = () => {
    return { 
      sender: 'ia', 
      text: `Olá, ${userName}! Eu sou o assistente virtual da Medipreço e estou aqui para te ajudar a entender nossos processos. Como posso te ajudar hoje?`
    };
  };

  const authFetch = async (url, options = {}) => {
    const localToken = localStorage.getItem('chatToken');
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    if (localToken) {
      headers['Authorization'] = `Bearer ${localToken}`;
    }
    
    const response = await fetch(url, { ...options, headers });

    if (response.status === 401 || response.status === 403) {
      handleLogout();
      throw new Error('Sessão expirada ou inválida.');
    }
    return response;
  };

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const response = await authFetch(`${API_URL}/chat/history`);
        if (!response.ok) {
          throw new Error('Erro ao buscar histórico.');
        }
        const history = await response.json();
        const welcomeMsg = getWelcomeMessage();
        
        setMessages([...history, welcomeMsg]);
        
      } catch (error) {
        console.error("Erro ao carregar histórico:", error);
        setMessages([getWelcomeMessage()]);
      }
      
      setShowSuggestions(true);
      setChipSetToShow(CHIP_SET_RESCUE);
      setIsLoading(false);
    };

    fetchHistory();
  }, [token, userName]);

  const handleSendMessage = async (userInput) => {
    setShowSuggestions(false);
    const userMessage = { sender: 'user', text: userInput };
    
    const history = messages;
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      const response = await authFetch(`${API_URL}/chat`, {
        method: 'POST',
        body: JSON.stringify({
          userInput: userInput,
          chatHistory: history,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao conectar com o backend.');
      }

      const data = await response.json();
      const iaMessage = { sender: 'ia', text: data.response };
      
      if (iaMessage.text.startsWith("Não entendi sua mensagem")) {
        setChipSetToShow(CHIP_SET_RESCUE);
        setShowSuggestions(true);
      }
      
      setMessages(prevMessages => [...prevMessages, iaMessage]);

    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      const errorMessage = { sender: 'ia', text: 'Desculpe, algo deu errado ao conectar.' };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    }

    setIsLoading(false);
  };
  
  const handleChipClick = (topic) => {
    if (topic === "Ver tópicos de ajuda") {
      setShowSuggestions(true);
      setChipSetToShow(CHIP_SET_MAIN_TOPICS);
    } else {
      handleSendMessage(topic);
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm("Tem certeza que deseja criar um novo chat? Todo o seu histórico atual será apagado.")) {
      return;
    }
    setIsLoading(true);
    try {
      await authFetch(`${API_URL}/chat/history`, {
        method: 'DELETE',
      });
      setMessages([getWelcomeMessage()]);
      setChipSetToShow(CHIP_SET_RESCUE);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Erro ao limpar histórico:", error);
    }
    setIsLoading(false);
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const email = emailInput.trim().toLowerCase();
    const password = passwordInput.trim();
    const name = nameInput.trim();

    if (!email || !password) {
      setError("Email e senha são obrigatórios.");
      return;
    }
    
    if (!isLoginView) {
      if (!name) {
        setError("O nome é obrigatório para o cadastro.");
        return;
      }
      if (passwordInput !== confirmPasswordInput) {
        setError("As senhas não coincidem.");
        return;
      }
    }

    const endpoint = isLoginView ? '/auth/login' : '/auth/register';
    const body = isLoginView ? { email, password } : { name, email, password };
    
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro desconhecido');
      }

      if (isLoginView) {
        localStorage.setItem('chatToken', data.token);
        localStorage.setItem('chatUserName', data.name);
        setToken(data.token);
        setUserName(data.name);
      } else {
        setSuccess("Cadastro bem-sucedido! Por favor, faça o login.");
        setError("");
        setIsLoginView(true);
        setPasswordInput("");
        setConfirmPasswordInput("");
      }
    } catch (err) {
      setError(err.message);
      setSuccess("");
    }
  };

  const handleLogout = () => {
    if (!window.confirm("Você tem certeza que quer sair?")) {
      return;
    }
    localStorage.removeItem('chatToken');
    localStorage.removeItem('chatUserName');
    setToken(null);
    setUserName(null);
    setMessages([]);
    setEmailInput("");
    setPasswordInput("");
  };

  const toggleAuthMode = () => {
    setIsLoginView(!isLoginView);
    setError("");
    setSuccess("");
  };

  if (!token) {
    return (
      <div className="login-container">
        <form onSubmit={handleAuthSubmit} className="login-form">
          <img src="/gradient_logo.png" alt="Logo Medipreço" className="login-logo" />
          <h2>{isLoginView ? 'Acesse seu Chat' : 'Crie sua Conta'}</h2>
          
          <p className="login-subtitle">
            {isLoginView 
              ? "Faça o login para acessar seu histórico." 
              : "Crie sua conta para começar a conversar."}
          </p>
          
          {!isLoginView && (
            <div className="password-wrapper">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Digite seu nome"
                className="login-input"
              />
            </div>
          )}
          
          <div className="password-wrapper">
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Digite seu e-mail"
              className="login-input"
            />
          </div>

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Digite sua senha"
              className="login-input"
            />
            <span className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {!isLoginView && (
            <div className="password-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPasswordInput}
                onChange={(e) => setConfirmPasswordInput(e.target.value)}
                placeholder="Confirme sua senha"
                className="login-input"
              />
              <span className="password-toggle-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          )}
          
          {error && <p className="login-error">{error}</p>}
          {success && <p className="login-success">{success}</p>}
          
          <button type="submit" className="login-button">
            {isLoginView ? 'Entrar' : 'Cadastrar'}
          </button>
          
          <p className="toggle-auth" onClick={toggleAuthMode}>
            {isLoginView ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça o login'}
          </p>
        </form>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <Header />
      <div className="chat-controls">
        <span className="welcome-text">Olá, {userName}!</span>
        <div className="chat-buttons">
          <button onClick={handleClearHistory} className="control-button clear-button">
            Novo Chat
          </button>
          <button onClick={handleLogout} className="control-button logout-button">
            Sair
          </button>
        </div>
      </div>
      <ChatWindow messages={messages} isLoading={isLoading} />
      {showSuggestions && (
        <SuggestionChips 
          topics={chipSetToShow} 
          onChipClick={handleChipClick} 
        />
      )}
      <InputBar onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}

export default App;